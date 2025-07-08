import { useState } from "react";
import { Action, MasterData } from "../types/action";
import PaginationControls from "@/components/PaginationControl";
import ObjectivesMenu from "./ObjectivesMenu";
import ObjectiveFormDialog from "./ObjectiveFormDialog";
import { FaPlus } from "react-icons/fa";
import { buildNewAction } from "../utils/actionUtils";
import { ObjectiveStatusBadge } from "./ObjectiveStatus";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";



interface Props {
  actions: Action[];
  masterData: MasterData
}

export default function ActionsTable({ actions, masterData }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [formAction, setFormAction] = useState<Action | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"edit" | "create" | null>(null);


  const { hasPermission } = useAuthStore();
  const canCreate = hasPermission(Modules.Objectives, Actions.Create);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(actions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentActions = actions.slice(startIndex, startIndex + rowsPerPage);

  const closeModal = () => {
    setModalMode(null);
    setFormAction(null);
  };

  const openCreateModal = () => {
    setFormAction(buildNewAction());
    setShowForm(true);
    setModalMode("create");
  };

  return (
    <div className="overflow-x-auto bg-gray-900 shadow-md rounded-lg p-6">
            {canCreate && (
        <button
          className="md:hidden fixed bottom-8 right-8 z-20 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
          onClick={openCreateModal}
          aria-label="Nuevo objetivo"
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
            <th className="p-4">Área</th>
            <th className="p-4">Objetivo</th>
            <th className="p-4">Acción</th>
            <th className="p-4">Descripción</th>
            <th className="p-4">Fechas</th>
            <th className="p-4">Estado</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {currentActions.map((act) => (
            <tr key={act.id} className="border-b border-gray-800  hover:bg-gray-700 transition-colors text-gray-300 text-sm text-center">
              <td className="py-4 px-0.5 flex items-center gap-2">
                {act.area.name}
              </td>
              <td className="py-4 px-0.5">{act.objective.name}</td>
              <td className="py-4 px-0.5 ">{act.name}</td>
              <td className="py-4 px-0.5 ">{act.description}</td>
              <td className="py-4 px-0.5">
                <div>
                  {new Date(act.startIn).toLocaleDateString("es-ES")}
                </div>
                <div>
                  {new Date(act.finisIn).toLocaleDateString("es-ES")}
                </div>
              </td>
              <td className="py-4 px-0.5 text-center flex items-center gap-2">
                <ObjectiveStatusBadge statusId={act.status.id} />
              </td>
              <td>
                <ObjectivesMenu
                  onEdit={() => { setFormAction(act); setModalMode("edit"); setShowForm(true); }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {formAction && showForm && (
        <ObjectiveFormDialog
          Action={formAction}
          open={showForm}
          masterData={masterData}
          mode={modalMode}
          onClose={closeModal}
        />

      )}
    </div>
  );
}
