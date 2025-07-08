import { useState } from "react";
import { Action, MasterData } from "../types/action";
import { FaChevronDown, FaChevronRight, FaExpand, FaCompress, FaPlus } from "react-icons/fa";
import { ObjectiveStatusBadge } from "./ObjectiveStatus";
import { buildNewAction } from "../utils/actionUtils";
import ObjectiveFormDialog from "./ObjectiveFormDialog";
import ObjectivesMenu from "./ObjectivesMenu";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";

interface Props {
  actions: Action[];
  masterData: MasterData
}



export default function ActionsTree({ actions, masterData }: Props) {
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({});
  const [expandedObjectives, setExpandedObjectives] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);

  const [formAction, setFormAction] = useState<Action | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"edit" | "create" | null>(null);

  const { hasPermission } = useAuthStore();
  const canCreate = hasPermission(Modules.Objectives, Actions.Create);

  const areasMap = new Map<string, string>();
  actions.forEach((act) => areasMap.set(act.area.id, act.area.name));
  const distinctAreas = Array.from(areasMap, ([id, name]) => ({ id, name }));

  const openCreateModal = () => {
    setFormAction(buildNewAction());
    setShowForm(true);
    setModalMode("create");
  };

  const closeModal = () => {
    setModalMode(null);
    setFormAction(null);
  };

  function getObjectivesForArea(areaId: string) {
    const objMap = new Map<string, string>();
    actions.forEach((act) => {
      if (act.area.id === areaId) objMap.set(act.objective.id, act.objective.name);
    });
    return Array.from(objMap, ([id, name]) => ({ id, name }));
  }

  function getActionsForObjective(objectiveId: string) {
    return actions.filter((act) => act.objective.id === objectiveId);
  }

  const toggleArea = (areaId: string) => {
    setExpandedAreas((prev) => ({ ...prev, [areaId]: !prev[areaId] }));
  };
  const toggleObjective = (objId: string) => {
    setExpandedObjectives((prev) => ({ ...prev, [objId]: !prev[objId] }));
  };

  const handleToggleAll = () => {
    const newState = !allExpanded;
    setAllExpanded(newState);

    const newExpandedAreas: Record<string, boolean> = {};
    distinctAreas.forEach((a) => (newExpandedAreas[a.id] = newState));
    setExpandedAreas(newExpandedAreas);

    const newExpandedObjectives: Record<string, boolean> = {};
    actions.forEach((act) => (newExpandedObjectives[act.objective.id] = newState));
    setExpandedObjectives(newExpandedObjectives);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-gray-200">
      {canCreate && (
        <button
          className="md:hidden fixed bottom-8 right-8 z-20 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
          onClick={openCreateModal}
          aria-label="Nuevo control"
        >
          <FaPlus />
        </button>
      )}
      <div className="flex justify-between items-center mb-6">
        {canCreate && (
          <button
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition text-sm"
            onClick={openCreateModal}
          >
            <FaPlus /> Nuevo
          </button>
        )}
        <button
          onClick={handleToggleAll}
          className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-500 transition flex items-center"
        >
          {allExpanded ? <FaCompress className="mr-2 text-xs" /> : <FaExpand className="mr-2 text-xs" />}
          {allExpanded ? "Contraer" : "Expandir"}
        </button>
      </div>

      {distinctAreas.map((area) => {
        const isAreaOpen: boolean = expandedAreas[area.id] || false;
        const objectives = getObjectivesForArea(area.id);

        return (
          <div key={`area-${area.id}`} className="mb-5 ">
            <div
              className="flex justify-between items-center bg-gray-800 p-3 rounded-md cursor-pointer hover:bg-gray-700 transition mb-3"
              onClick={() => toggleArea(area.id)}
            >
              <div className="flex items-center">
                <button className="mr-2 text-sm text-gray-400 hover:text-white">
                  {isAreaOpen ? <FaChevronDown /> : <FaChevronRight />}
                </button>
                <h3 className="font-semibold text-lg ml-2">{area.name}</h3>
              </div>
            </div>
            {isAreaOpen && (
              <ul className="ml-6 border-l border-gray-600 pl-4">
                {objectives.map((obj) => {
                  const isObjOpen = expandedObjectives[obj.id] || false;
                  const objActions = getActionsForObjective(obj.id);

                  return (
                    <li key={`obj-${obj.id}`} className="mb-3">
                      <div
                        className="flex justify-between items-center bg-gray-800 p-3 rounded-md cursor-pointer hover:bg-gray-700 transition  mb-3"
                        onClick={() => toggleObjective(obj.id)}
                      >
                        <div className="flex items-center">
                          <button className="mr-2 text-sm text-gray-400 hover:text-white">
                            {isObjOpen ? <FaChevronDown /> : <FaChevronRight />}
                          </button>
                          <h3 className="ml-2 font-semibold">{obj.name}</h3>
                        </div>
                      </div>
                      {isObjOpen && (
                        <ul className="ml-6 border-l border-gray-600 pl-4">
                          {objActions.map((act) => (
                            <li key={`act-${act.id}`} className="mb-3 flex flex-col bg-gray-800 p-3 rounded-md hover:bg-gray-700 transition">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{act.name}</span>
                                <div className="flex items-center gap-3 ml-auto">
                                  <ObjectiveStatusBadge statusId={act.status.id} />
                                  <ObjectivesMenu
                                    onEdit={() => { setFormAction(act); setModalMode("edit"); setShowForm(true); }} />
                                </div>
                              </div>
                              <div className="text-sm text-gray-400 mt-1 w-full">{act.description}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                Inicio: {act.startIn ? new Date(act.startIn).toLocaleDateString() : "Sin fecha"}{" "}
                                | Fin: {act.finisIn ? new Date(act.finisIn).toLocaleDateString() : "Sin fecha"}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}

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
