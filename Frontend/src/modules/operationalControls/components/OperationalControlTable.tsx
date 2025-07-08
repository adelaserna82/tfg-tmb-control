import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ActualControl, MasterData, Revision } from "../types/operationalControl";
import { sortRevisionsByDateAscending } from "../utils/dateUtils";
import { buildNewActualControl } from "../utils/actualControlUtils";
import PaginationControls from "@/components/PaginationControl";
import OperationalControlActionsMenu from "./OperationalControlActionsMenu";
import OperationalControlHistoryDialog from "./OperationalControlHistoryDialog";
import OperationalControlFormDialog from "./OperationalControlFormDialog";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";


interface Props {
  actualControls: ActualControl[];
  masterData: MasterData;
  resetPageTrigger?: number;
}

export default function OperationalControlTable(
  { actualControls,
    masterData,
    resetPageTrigger
  }: Props) {
  const [selectedHistory, setSelectedHistory] = useState<Revision[] | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [formActualControl, setFormActualControl] = useState<ActualControl | null>(null);
  const [modalMode, setModalMode] = useState<"edit" | "create" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(actualControls.length / itemsPerPage);
  const pagedActualControls = actualControls.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const { hasPermission } = useAuthStore();
  const canCreate = hasPermission(Modules.OperationalControl, Actions.Create);

  useEffect(() => {
    setCurrentPage(1);
  }, [resetPageTrigger]);

  const openHistoryModal = (item: ActualControl) => {
    const sorted = sortRevisionsByDateAscending((item.revisions || []));
    setSelectedHistory(sorted);
    setIsHistoryModalOpen(true);
  };

  const openEditModal = (item: ActualControl) => {
    setFormActualControl(item);
    setModalMode("edit");
  };

  const openCreateModal = () => {
    setFormActualControl(buildNewActualControl());
    setModalMode("create");
  };

  const closeModal = () => {
    setModalMode(null);
    setFormActualControl(null);
  };


  return (
    <div className="overflow-x-auto bg-gray-900 shadow-md rounded-lg p-6">
      {canCreate && (
        <button
          className="md:hidden fixed bottom-8 right-8 z-20 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
          onClick={openCreateModal}
          aria-label="Nuevo control"
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
            <FaPlus /> Nuevo
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
          <tr className="bg-gray-900 text-gray-400 text-sm border-b border-gray-800 text-center">
            <th className="p-4">Grupo</th>
            <th className="p-4">Concepto</th>
            <th className="p-4">Control</th>
            <th className="p-4">Última Revisión</th>
            <th className="p-4">Frecuencia</th>
            <th className="p-4">Próxima Revisión</th>
            <th className="p-4">Situación</th>
            <th className="p-4">Observaciones</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {pagedActualControls.map((item) => (
            <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-700 transition-colors text-gray-300 text-center">
              <td className="py-4 px-0.5 ">{item.group?.name ?? "-"}</td>
              <td className="py-4 px-0.5 ">{item.concept}</td>
              <td className="py-4 px-0.5 ">{item.control}</td>
              <td className="py-4 px-0.5 ">
                {item.lastReview ? new Date(item.lastReview).toLocaleDateString("es-ES") : "-"}
              </td>
              <td className="py-4 px-0.5 ">{item.frequency?.name ?? "-"}</td>
              <td className="py-4 px-0.5 ">
                {item.nextReview ? new Date(item.nextReview).toLocaleDateString("es-ES") : "-"}
              </td>
              <td className="py-4 px-0.5 ">{item.status.name}</td>
              <td className="py-4 px-0.5 ">
                <span title={item.observations ?? ''}>
                  {(item.observations ?? '-').length > 50
                    ? (item.observations?.substring(0, 50) + '...')
                    : (item.observations ?? '-')}
                </span>
              </td>
              <td className="py-4 px-0.5 text-center flex gap-2">
                <OperationalControlActionsMenu
                  onEdit={() => openEditModal(item)}
                  onViewHistory={() => openHistoryModal(item)}
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


      <OperationalControlHistoryDialog
        open={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={selectedHistory}
      />

      {formActualControl && (
        <OperationalControlFormDialog
          open={modalMode !== null}
          onClose={closeModal}
          actualControl={formActualControl}
          // formActualControl={formActualControl}
          // setFormActualControl={setFormActualControl}
          // onSave={handleSave}
          mode={modalMode}
          masterData={masterData}
        // onDelete={handleDelete}
        // onFinish={handleFinish}
        />
      )}


    </div>
  );
}
