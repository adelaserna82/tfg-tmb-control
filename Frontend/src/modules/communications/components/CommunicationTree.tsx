import { useState } from "react";
import { FaChevronDown, FaChevronRight, FaExpand, FaCompress, FaPlus } from "react-icons/fa";
import { Communication, MasterData } from "../types/communication";
import { sortByDateAscending } from "../utils/dateUtils";
import CommunicationFormDialog from "./CommunicationFormDialog";
import CommunicationHistoryDialog from "./CommunicationHistoryDialog";
import CommunicationActionsMenu from "./CommunicationActionsMenu";
import { buildChildCommunication, buildNewCommunication, getHistory } from "../utils/communicationUtils";
import { CommunicationStatusBadge } from "./CommunicationStatus";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";

interface Props {
  communications: Communication[];
  communicationsWithOutFilters: Communication[];
  masterData: MasterData;
}


export default function CommunicationTree(
  {
    communications, communicationsWithOutFilters, masterData
  }: Props) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [formComm, setFormComm] = useState<Communication | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<Communication[] | null>(null);

  const { hasPermission } = useAuthStore();
  const canCreate = hasPermission(Modules.Communications, Actions.Create);

  let filteredCommunications = [...communications];


  const sortedParents = sortByDateAscending(
    filteredCommunications.filter((comm) => comm.relatedId === null)
  );

  const groupedCommunications = sortedParents.reduce<Record<string, Communication[]>>(
    (acc, parent) => {
      const children = sortByDateAscending(
        filteredCommunications.filter((c) => c.relatedId === parent.id)
      );
      acc[parent.id] = children;
      return acc;
    },
    {}
  );

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const newState = !allExpanded;
    setAllExpanded(newState);
    const newExpandedNodes = sortedParents.reduce((acc, parent) => {
      acc[parent.id] = newState;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedNodes(newExpandedNodes);
  };


  const closeModal = () => {
    setModalMode(null);
    setFormComm(null);
  };



  const openCreateModal = () => {
    setFormComm(buildNewCommunication());
    setModalMode("create");
  };


  const openHistoryModal = (comm: Communication) => {
    setSelectedHistory(getHistory(comm, communicationsWithOutFilters));
    setIsModalOpen(true);
  };

  const openEditModal = (comm: Communication) => {
    setFormComm(comm);
    setModalMode("edit");
  };


  const openCreateChildModal = (parent: Communication) => {
    setFormComm(buildChildCommunication(parent));
    setModalMode("create");
  };


  return (
    <>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-gray-200">
        {canCreate && (
          <button
            className="md:hidden fixed bottom-8 right-8 z-20 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
            onClick={openCreateModal}
            aria-label="Nueva comunicación"
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
              <FaPlus /> Nueva
            </button>
          )}
          <button
            onClick={toggleAll}
            className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-500 transition flex items-center"
          >
            {allExpanded ? <FaCompress className="mr-2 text-xs" /> : <FaExpand className="mr-2 text-xs" />}
            {allExpanded ? "Contraer" : "Expandir"}
          </button>
        </div>

        {sortedParents.map((parent) => {
          const childCount = groupedCommunications[parent.id]?.length || 0;
          const hasChildren = childCount > 0;

          return (
            <div
              key={parent.id}
              className={`mb-5 `}
            >
              <div
                className={`p-3 rounded-md transition ${hasChildren ? "bg-gray-800 cursor-pointer hover:bg-gray-700" : "bg-gray-800"}`}
                onClick={hasChildren ? () => toggleNode(parent.id) : undefined}
              >
                <div className="flex flex-row justify-between items-start gap-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                    {hasChildren && (
                      <button
                        className="mr-2 text-sm text-gray-400 hover:text-white"
                        tabIndex={-1}
                        onClick={e => { e.stopPropagation(); toggleNode(parent.id); }}
                      >
                        {expandedNodes[parent.id] ? <FaChevronDown /> : <FaChevronRight />}
                      </button>
                    )}
                    <span className="font-semibold text-lg">{parent.category.name}</span>
                    <span className="text-gray-400">({parent.origin.name})</span>
                    {parent.format?.name && (
                      <span className="text-sm text-gray-400">{parent.format.name}</span>
                    )}
                    <span className="text-sm text-gray-400">
                      {new Date(parent.date).toLocaleDateString("es-ES")}
                    </span>
                    {parent.dueDate && (
                      <span className="text-gray-400 text-sm">
                        Vence el {new Date(parent.dueDate).toLocaleDateString("es-ES")}
                      </span>
                    )}
                    <span className="text-gray-400">
                      {parent.responsibles && parent.responsibles.length > 0
                        ? parent.responsibles.map((r, i) => (
                          <span key={r.id}>
                            {i > 0 && ", "}
                            {r.name}
                          </span>
                        ))
                        : ""}
                    </span>
                    {hasChildren && (
                      <span className="text-sm text-green-400">({childCount} documentos)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <CommunicationStatusBadge statusId={parent.status.id} />
                    <CommunicationActionsMenu
                      communication={parent}
                      onEdit={() => openEditModal(parent)}
                      onViewHistory={() => openHistoryModal(parent)}
                      onCreateChild={() => openCreateChildModal(parent)}
                    />
                  </div>
                </div>
                {parent.description && (
                  <div className="mt-2 text-gray-400 text-sm line-clamp-3 break-words ml-2">
                    {parent.description}
                  </div>
                )}
              </div>

              {hasChildren && (
                <ul
                  className={`ml-6 border-l border-gray-600 pl-4 mt-2 transition-all ${expandedNodes[parent.id] ? "block" : "hidden"
                    }`}
                >
                  {groupedCommunications[parent.id]?.map((child) => (
                    <li
                      key={child.id}
                      className="mb-3 bg-gray-800 p-3 rounded-md hover:bg-gray-700 transition flex flex-col"
                    >
                      <div className="flex flex-row justify-between items-start gap-4">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                          <span className="font-medium truncate">{child.category.name}</span>
                          <span className="text-gray-400 truncate">({child.origin.name})</span>
                          {child.format?.name && (
                            <span className="text-sm text-gray-400 truncate">{child.format.name}</span>
                          )}
                          <span className="text-sm text-gray-400 truncate">
                            {new Date(child.date).toLocaleDateString("es-ES")}
                          </span>
                          {parent.dueDate && (
                            <span className="text-gray-400 text-sm truncate">
                              Vence el {new Date(parent.dueDate).toLocaleDateString("es-ES")}
                            </span>
                          )}
                          <span className="text-gray-400 truncate">
                            {child.responsibles && child.responsibles.length > 0
                              ? child.responsibles.map((r, i) => (
                                <span key={r.id}>
                                  {i > 0 && ", "}
                                  {r.name}
                                </span>
                              ))
                              : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <CommunicationStatusBadge statusId={child.status.id} />
                          <CommunicationActionsMenu
                            communication={child}
                            onEdit={() => openEditModal(child)}
                            onViewHistory={() => openHistoryModal(child)}
                            onCreateChild={() => openCreateChildModal(child)}
                          />
                        </div>
                      </div>
                      {child.description && (
                        <div className="mt-2 text-gray-400 text-sm line-clamp-3 break-words">
                          {child.description}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
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

    </>

  );
}
