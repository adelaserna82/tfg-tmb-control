import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ActualControl, Frequency, Group, MasterData } from "../types/operationalControl";
import { useState } from "react";
import { getGetAllActualControlsQueryKey, useCreateActualControl, useCreateFrequency, useCreateGroup, useDeleteActualControl, useFinishActualControl, useUpdateActualControl } from "@/api/generated/operational-control";
import { actualControlToCreateReq, operationalControlFinishedToReq, operationalControlFrecuencyToCreateReq, operationalControlGroupToCreateReq } from "../types/adapters";
import DialogBox from "@/components/DialogBox";
import { queryClient } from "@/lib/queryClient";
import { getGetOperationalControlMasterDataQueryKey } from '../../../api/generated/operational-control';
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";

interface Props {
  open: boolean;
  onClose: () => void;
  actualControl: ActualControl;
  mode: "create" | "edit" | null;
  masterData: MasterData;
}

export default function OperationalControlFormDialog({
  open,
  onClose,
  actualControl,
  mode,
  masterData,
}: Props) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmDeleteCode, setConfirmDeleteCode] = useState("");
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);
  const [newGroup, setNewGroup] = useState<Group>({ id: 0, name: "" });
  const [showNewFrequencyInput, setShowNewFrequencyInput] = useState(false);
  const [newFrequency, setNewFrequency] = useState<Frequency>({ id: 0, name: "" });
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [formActualControl, setFormActualControl] = useState<ActualControl>(actualControl);

  const { hasPermission } = useAuthStore();
  const canCreate = hasPermission(Modules.OperationalControl, Actions.Create);
  const canEdit = hasPermission(Modules.OperationalControl, Actions.Edit);
  const canDelete = hasPermission(Modules.OperationalControl, Actions.Delete);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!formActualControl) return;
    const { name, value } = e.target;

    if (name === "groupId") {
      const selectedGroup = masterData.groups.find((g) => g.id === parseInt(value));
      if (selectedGroup) {
        setFormActualControl({ ...formActualControl, group: selectedGroup });
      }
    } else if (name === "frequencyId") {
      const selectedFreq = masterData.frequencies.find((f) => f.id === parseInt(value));
      if (selectedFreq) {
        setFormActualControl({ ...formActualControl, frequency: selectedFreq });
      }
    } else if (name === "statusId") {
      const selectedStatus = masterData.statuses.find((s) => s.id === parseInt(value));
      if (selectedStatus) {
        setFormActualControl({ ...formActualControl, status: selectedStatus });
      }
    } else {
      setFormActualControl({ ...formActualControl, [name]: value });
    }
  };



  const createGroupMutation = useCreateGroup({
    mutation: {
      onSuccess: (response) => {
        const { data: id } = response;
        const g: Group = { id: id, name: newGroup.name };
        setFormActualControl({ ...formActualControl!, group: g });
        setNewGroup({ id: 0, name: "" });
        setShowNewGroupInput(false);
        queryClient.invalidateQueries({
          queryKey: getGetOperationalControlMasterDataQueryKey(),
        });
      }
    }
  });

  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) return;
    createGroupMutation.mutate({
      data: operationalControlGroupToCreateReq(newGroup),
    });
  };

  const createFrequencyMutation = useCreateFrequency({
    mutation: {
      onSuccess: (response) => {
        const { data: id } = response;
        const f: Frequency = { id: id, name: newFrequency.name };
        setFormActualControl({ ...formActualControl!, frequency: f });
        setNewFrequency({ id: 0, name: "" });
        setShowNewFrequencyInput(false);
        queryClient.invalidateQueries({
          queryKey: getGetOperationalControlMasterDataQueryKey(),
        });
      }
    }
  });

  const handleCreateFrequency = () => {
    if (!newFrequency.name.trim()) return;
    createFrequencyMutation.mutate({
      data: operationalControlFrecuencyToCreateReq(newFrequency),
    });

  };

  const createMutation = useCreateActualControl({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAllActualControlsQueryKey(),
        });
        onClose();
      },
    },
  });

  const updateMutation = useUpdateActualControl({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAllActualControlsQueryKey(),
        });
        onClose();
      },
    },
  });

  const deleteMutation = useDeleteActualControl({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAllActualControlsQueryKey(),
        });
        onClose();
      },
    },
  });

  const handleCreate = (newControl: ActualControl) => {
    createMutation.mutate({
      data: actualControlToCreateReq(newControl),
    });
  };

  const handleUpdate = (updatedControl: ActualControl) => {
    updateMutation.mutate({
      id: updatedControl.id,
      data: actualControlToCreateReq(updatedControl),
    });
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(false);
    deleteMutation.mutate({
      id: formActualControl.id,
    });
  };

  const handleSave = () => {

    if (mode === "create") {
      handleCreate(formActualControl);
    } else if (mode === "edit") {
      handleUpdate(formActualControl);
    }

  };

  const finishActualControl = useFinishActualControl({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAllActualControlsQueryKey(),
        });
        setShowFinishConfirmation(false);
        onClose();
      },
    },
  });

  const handleConfirmFinish = () => {
    if (!formActualControl) return;
    finishActualControl.mutate({
      id: formActualControl.id,
      data: operationalControlFinishedToReq(formActualControl.observations),
    });
  };

  const handleMarkReviewed = () => {
    setShowFinishConfirmation(true);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg bg-gray-800 text-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-lg font-semibold">
            {mode === "create" ? "Crear Control Operacional" : "Editar Control Operacional"}
          </DialogTitle>
          {formActualControl && (
            <form
              className="mt-4 space-y-4"
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400">Concepto:</label>
                  <input
                    name="concept"
                    value={formActualControl.concept}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md"
                    required={true}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400">Control:</label>
                  <input
                    name="control"
                    value={formActualControl.control}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md"
                    required={true}
                  />
                </div>

                <div>

                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm text-gray-400">Grupo:</label>
                    {canCreate && (
                      <button
                        type="button"
                        className="text-green-500 text-sm font-medium hover:underline focus:outline-none"
                        onClick={() => setShowNewGroupInput((v) => !v)}
                        title="Añadir nuevo formato"
                      >
                        + Nuevo grupo
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <select
                      name="groupId"
                      value={formActualControl.group.id}
                      onChange={handleChange}
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md"
                      disabled={showNewGroupInput}
                    >
                      <option value="">Selecciona un grupo</option>
                      {masterData.groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {showNewGroupInput && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Nuevo grupo"
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                      />
                      <div className="flex justify-between mt-2">
                        <button
                          type="button"
                          className="px-2 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-600"
                          onClick={handleCreateGroup}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                          onClick={() => {
                            setShowNewGroupInput(false);
                            setNewGroup({ id: 0, name: "" });
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>

                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm text-gray-400">Frecuencia:</label>
                    {canCreate && (
                      <button
                        type="button"
                        className="text-green-500 text-sm font-medium hover:underline focus:outline-none"
                        onClick={() => setShowNewFrequencyInput((v) => !v)}
                        title="Añadir nuevo formato"
                      >
                        + Nueva frecuencia
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <select
                      name="frequencyId"
                      value={formActualControl.frequency.id}
                      onChange={handleChange}
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md"
                      disabled={showNewFrequencyInput}
                    >
                      <option value="">Selecciona una frecuencia</option>
                      {masterData.frequencies.map((freq) => (
                        <option key={freq.id} value={freq.id}>
                          {freq.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {showNewFrequencyInput && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Nueva frecuencia"
                        value={newFrequency.name}
                        onChange={(e) => setNewFrequency({ ...newFrequency, name: e.target.value })}
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                      />
                      <div className="flex justify-between mt-2">
                        <button
                          type="button"
                          className="px-2 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-600"
                          onClick={handleCreateFrequency}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                          onClick={() => {
                            setShowNewFrequencyInput(false);
                            setNewFrequency({ id: 0, name: "" });
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400">Última Revisión:</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="lastReview"
                        value={formActualControl.lastReview ?? ""}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                        style={{
                          colorScheme: "dark",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400">Próxima Revisión:</label>
                    <input
                      type="date"
                      name="nextReview"
                      value={formActualControl.nextReview ?? ""}
                      onChange={handleChange}
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                      style={{
                        colorScheme: "dark",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400">Observaciones:</label>
                  <textarea
                    name="observations"
                    value={formActualControl.observations ?? ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md"
                  />
                </div>

                {canEdit && mode === "edit" && (
                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={handleMarkReviewed}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-md text-sm"
                    >
                      ✅ Marcar revisión realizada
                    </button>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  {(mode === "create" ? canCreate : canEdit) && (
                    <button
                      type="submit"
                      className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500"
                    >
                      {mode === "create" ? "Crear" : "Guardar"}
                    </button>
                  )}
                </div>

                {canDelete && mode === "edit" && formActualControl?.id && (
                  <div className="border-t border-gray-700 pt-6 mt-8 mb-2">
                    <p
                      className="text-sm text-red-400 font-semibold mb-2 cursor-pointer hover:underline"
                      onClick={() => setShowDeleteConfirmation(true)}
                    >
                      Eliminar control operacional
                    </p>
                    {showDeleteConfirmation && (
                      <>
                        <p className="text-sm text-gray-400 mb-2">
                          Esta acción no se puede deshacer. Escribe{" "}
                          <span className="font-mono bg-gray-700 px-1 py-0.5 rounded">
                            {formActualControl.id}
                          </span>{" "}
                          para confirmar.
                        </p>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Escribe el ID del control"
                            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                            value={confirmDeleteCode}
                            onChange={(e) => setConfirmDeleteCode(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={handleDelete}
                            disabled={confirmDeleteCode !== formActualControl.id}
                            className={`px-4 py-2 rounded-md transition ${confirmDeleteCode === formActualControl.id
                              ? "bg-red-600 hover:bg-red-500 text-white"
                              : "bg-gray-700 text-gray-400 cursor-not-allowed"
                              }`}
                          >
                            Confirmar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </form>
          )}
        </DialogPanel>
        <DialogBox
          isOpen={showFinishConfirmation}
          onClose={() => setShowFinishConfirmation(false)}
          title="Confirmar revisión"
          message="¿Estás seguro de marcar esta revisión como realizada? Esto registrará la revisión y vaciará los campos."
          confirmText="Sí, finalizar revisión"
          cancelText="Cancelar"
          confirmColor="bg-yellow-600 hover:bg-yellow-500"
          iconColor="text-yellow-500"
          onConfirm={handleConfirmFinish}
        />
      </div>
    </Dialog>
  );
}
