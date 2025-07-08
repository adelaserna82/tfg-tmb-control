import { useEffect, useState } from "react";
import { Communication, MasterData } from "../types/communication";
import { FaPlus } from "react-icons/fa";
import CommunicationHistoryDialog from "./CommunicationHistoryDialog";
import CommunicationFormDialog from "./CommunicationFormDialog";
import CommunicationActionsMenu from "./CommunicationActionsMenu";
import { getHistory, buildNewCommunication, buildChildCommunication } from "../utils/communicationUtils";
import { CommunicationStatusBadge } from "./CommunicationStatus";
import PaginationControls from "@/components/PaginationControl";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";

interface Props {
  communications: Communication[];
  communicationsWithOutFilters: Communication[];
  masterData: MasterData;
  resetPageTrigger?: number;
}

export default function CommunicationTable(
  {
    communications,
    communicationsWithOutFilters,
    masterData,
    resetPageTrigger }: Props) {
  const [selectedHistory, setSelectedHistory] = useState<Communication[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"edit" | "create" | null>(null);
  const [formComm, setFormComm] = useState<Communication | null>(null);

  const { hasPermission } = useAuthStore();
  const canCreate = hasPermission(Modules.Communications, Actions.Create);


  // Paginación interna
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(communications.length / itemsPerPage);
  const pagedCommunications = communications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [resetPageTrigger]);

  const openHistoryModal = (comm: Communication) => {

    setSelectedHistory(getHistory(comm, communicationsWithOutFilters));
    setIsModalOpen(true);
  };

  const openEditModal = (comm: Communication) => {
    setFormComm(comm);
    setModalMode("edit");
  };

  const openCreateModal = () => {

    setFormComm(buildNewCommunication());
    setModalMode("create");
  };

  const openCreateChildModal = (parent: Communication) => {

    setFormComm(buildChildCommunication(parent));
    setModalMode("create");
  };

  const closeModal = () => {
    setModalMode(null);
    setFormComm(null);
  };



  return (
    <div className="overflow-x-auto bg-gray-900 shadow-md rounded-lg p-6">
      {canCreate && (
        <button
          className="md:hidden fixed bottom-8 right-8 z-20 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
          onClick={openCreateModal}
          aria-label="Nueva comunicación"
        >
          <FaPlus />
        </button>
      )}
      <div className="flex justify-between items-center mb-4">
        {canCreate && (
          <button
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition text-sm"
            onClick={openCreateModal}
          >
            <FaPlus /> Nueva
          </button>
        )}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-900 text-gray-400 text-sm text-center  border-b border-gray-800">
            <th className="p-4">Tipo</th>
            <th className="p-4">Origen</th>
            <th className="p-4">Formato</th>
            <th className="p-4">Fechas </th>
            <th className="p-4">Descripción</th>
            <th className="p-4">Padre</th>
            <th className="p-4">Responsables</th>
            <th className="p-4">Estado</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {pagedCommunications.map((comm) => (
            <tr key={comm.id} className="border-b border-gray-800  hover:bg-gray-700 transition-colors text-sm  text-center text-gray-300">
              <td className="py-4 px-0.5">{comm.category.name}</td>
              <td className="py-4 px-0.5">{comm.origin.name}</td>
              <td className="py-4 px-0.5">{comm.format?.name ?? ""}</td>
              <td className="py-4 px-0.5">
                {new Date(comm.date).toLocaleDateString("es-ES")}
                {comm.dueDate && (
                  <span className=" block">
                    {" "}
                    Vence el {new Date(comm.dueDate).toLocaleDateString("es-ES")}
                  </span>
                )}
              </td>
              <td className="py-4 px-0.5">{comm.description}</td>
              <td className="py-4 px-0.5">
                {comm.related ? (
                  <div>
                    <div>{comm.related.origin?.name ?? "-"}</div>
                    <div>{comm.related.date ? new Date(comm.related.date).toLocaleDateString("es-ES") : "-"}</div>
                    <div className="text-xs">{comm.related.description}</div>
                  </div>
                ) : (
                  "-"
                )}
              </td>
              <td className="py-4 px-0.5">
                {comm.responsibles && comm.responsibles.length > 0
                  ? comm.responsibles.map(r => r.name).join(", ")
                  : ""}
              </td>
              <td className="py-4 px-0.5 text-center ">
                <CommunicationStatusBadge statusId={comm.status.id} />
              </td>
              <td className="py-4  px-0.5 text-center relative">
                <CommunicationActionsMenu
                  communication={comm}
                  onEdit={() => openEditModal(comm)}
                  onViewHistory={() => openHistoryModal(comm)}
                  onCreateChild={() => openCreateChildModal(comm)}
                />
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <CommunicationHistoryDialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        history={selectedHistory}
      />

      {formComm !== null && (

        <CommunicationFormDialog
          open={modalMode !== null}
          onClose={closeModal}
          mode={modalMode}
          communication={formComm}
          masterData={masterData}
          communicationsWithOutFilters={communicationsWithOutFilters}
        />

      )}


    </div>
  );
}
