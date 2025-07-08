import { useState } from "react";
import { Action, MasterData } from "../types/action";
import { GroupedArea } from "../types/groupedArea";
import { groupByAreaObjective } from "../utils/groupByAreaObjective";
import ObjectiveFormDialog from "./ObjectiveFormDialog";
import { buildNewAction } from "../utils/actionUtils";
import { FaPlus } from "react-icons/fa";
import { ObjectiveStatusBadge } from "./ObjectiveStatus";
import ObjectivesMenu from "./ObjectivesMenu";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";

interface Props {
  actions: Action[];
  masterData: MasterData;
}

const areaColors = [
  "bg-blue-900",
  "bg-green-900",
  "bg-purple-900",
  "bg-red-900",
  "bg-yellow-900",
  "bg-teal-900",
  "bg-indigo-900",
  "bg-pink-900",
];

export default function ObjetivesAsExcel({ actions, masterData }: Props) {
  const groupedAreas: GroupedArea[] = groupByAreaObjective(actions);
  const [formAction, setFormAction] = useState<Action | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"edit" | "create" | null>(null);

  const { hasPermission } = useAuthStore();
  const canCreate = hasPermission(Modules.Objectives, Actions.Create);

  const openCreateModal = () => {
    setFormAction(buildNewAction());
    setShowForm(true);
    setModalMode("create");
  };

  const closeModal = () => {
    setModalMode(null);
    setFormAction(null);
  };


  return (
    <div className="overflow-x-auto bg-gray-900 shadow-md rounded-md p-4">
      {canCreate && (
        <>
          <button
            className="md:hidden fixed bottom-8 right-8 z-20 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
            onClick={openCreateModal}
            aria-label="Nuevo control"
          >
            <FaPlus />
          </button>
          <button
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition text-sm"
            onClick={openCreateModal}
          >
            <FaPlus /> Nuevo
          </button>
        </>


      )}
      <table className="w-full border-collapse border border-gray-700 mt-2 text-sm">
        <thead>
          <tr className="bg-gray-800 text-gray-200">
            <th className="p-3 border border-gray-700">Área</th>
            <th className="p-3 border border-gray-700">Objetivo</th>
            <th className="p-3 border border-gray-700">Acción</th>
            <th className="p-3 border border-gray-700">Descripción</th>
            <th className="p-3 border border-gray-700">Fechas</th>
            <th className="p-3 border border-gray-700">Estado</th>
          </tr>
        </thead>
        <tbody>
          {groupedAreas.map((ga, areaIndex) => {
            const totalAreaActions = ga.objectives.reduce(
              (sum, obj) => sum + obj.actions.length,
              0
            );

            const areaColor = areaColors[areaIndex % areaColors.length];

            return ga.objectives.map((obj, objIndex) => {
              const totalObjActions = obj.actions.length;

              return obj.actions.map((act, actIndex) => {
                const showAreaCell = objIndex === 0 && actIndex === 0;
                const showObjectiveCell = actIndex === 0;

                return (
                  <tr key={act.id} className={`${areaColor} align-middle border border-gray-700 text-gray-200  text-sm`}>
                    {showAreaCell ? (
                      <td
                        rowSpan={totalAreaActions}
                        className="p-3   border border-gray-700"
                      >
                        {ga.areaName}
                      </td>
                    ) : null}
                    {showObjectiveCell ? (
                      <td
                        rowSpan={totalObjActions}
                        className="p-3  border border-gray-700"
                      >
                        {obj.objectiveName}
                      </td>
                    ) : null}
                    <td className="p-3  border border-gray-700">
                      {act.name}
                    </td>
                    <td className="p-3  border border-gray-700">
                      {act.description}
                    </td>
                    <td className="p-3  border border-gray-700">
                      <span>
                        <span className="font-semibold text-gray-400">[</span>
                        <span>
                          {act.startIn
                            ? new Date(act.startIn).toLocaleDateString(navigator.language)
                            : "-"}
                        </span>
                        <span className="font-semibold text-gray-400"> - </span>
                        <span>
                          {act.finisIn
                            ? new Date(act.finisIn).toLocaleDateString(navigator.language)
                            : "-"}
                        </span>
                        <span className="font-semibold text-gray-400">]</span>
                      </span>
                    </td>
                    <td className="p-3 text-gray-300  border border-gray-700">
                      <div className="flex justify-between items-center">
                        <ObjectiveStatusBadge statusId={act.status.id} />
                        <ObjectivesMenu
                          onEdit={() => {
                            setFormAction(act);
                            setModalMode("edit");
                            setShowForm(true);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              });
            });
          })}
        </tbody>
      </table>
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
