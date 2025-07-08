import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { MasterData, Area, Objective, Action } from "../types/action";
import { getGetAllActionPlansQueryKey, getGetObjectiveMasterDataQueryKey, useCreateActionPlan, useCreateArea, useCreateObjective, useDeleteActionPlan, useUpdateActionPlan } from "@/api/generated/action-plans";
import { queryClient } from "@/lib/queryClient";
import { actionToCreateReq, actionToUpdateReq, objectiveToCreateReq } from "../types/adapters";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit" | null;
  Action: Action;
  masterData: MasterData;
}

export default function ObjectiveFormDialog({ open, onClose, mode, Action, masterData }: Props) {
  const [formData, setFormData] = useState<Action>(Action);
  const [showNewAreaInput, setShowNewAreaInput] = useState(false);
  const [newArea, setNewArea] = useState<Area>({ id: "", name: "", description: "" });
  const [showNewObjectiveInput, setShowNewObjectiveInput] = useState(false);
  const [newObjective, setNewObjective] = useState<Objective>({ id: "", name: "", description: "" });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmDeleteCode, setConfirmDeleteCode] = useState("");

  const { hasPermission } = useAuthStore();
  const canCreate = hasPermission(Modules.Objectives, Actions.Create);
  const canEdit = hasPermission(Modules.Objectives, Actions.Edit);
  const canDelete = hasPermission(Modules.Objectives, Actions.Delete);


  const createAreaMutation = useCreateArea({
    mutation: {
      onSuccess: (response) => {
        const { data: id } = response;
        const a: Area = { id: id, name: newArea.name, description: "" };
        setFormData({ ...formData!, area: a });
        setNewArea({ id: "", name: "", description: "" });
        setShowNewAreaInput(false);
        queryClient.invalidateQueries({
          queryKey: getGetObjectiveMasterDataQueryKey(),
        });
      }
    }
  });

  const handleCreateArea = () => {
    if (!newArea.name.trim()) return;
    createAreaMutation.mutate({
      data: objectiveToCreateReq(newArea),
    });
  };

  const createObjectiveMutation = useCreateObjective({
    mutation: {
      onSuccess: (response) => {
        const { data: id } = response;
        const o: Objective = { id: id, name: newObjective.name, description: "" };
        setFormData({ ...formData!, objective: o });
        setNewObjective({ id: "", name: "", description: "" });
        setShowNewObjectiveInput(false);
        queryClient.invalidateQueries({
          queryKey: getGetObjectiveMasterDataQueryKey(),
        });
      }
    }
  });


  const handleCreateObjective = () => {
    if (!newObjective.name.trim()) return;
    createObjectiveMutation.mutate({
      data: objectiveToCreateReq(newObjective),
    });
  };

  const createMutation = useCreateActionPlan({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAllActionPlansQueryKey(),
        });
        onClose();
      },
    },
  });

  const updateMutation = useUpdateActionPlan({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAllActionPlansQueryKey(),
        });
        onClose();
      },
    },
  });

  const deleteMutation = useDeleteActionPlan({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAllActionPlansQueryKey(),
        });
        onClose();
      },
    },
  });

  const handleCreate = (newControl: Action) => {
    createMutation.mutate({
      data: actionToUpdateReq(newControl),
    });
  };

  const handleUpdate = (updatedControl: Action) => {
    updateMutation.mutate({
      id: updatedControl.id,
      data: actionToCreateReq(updatedControl),
    });
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(false);
    deleteMutation.mutate({
      id: formData.id,
    });
  };

  const handleSave = () => {

    if (mode === "create") {
      handleCreate(formData);
    } else if (mode === "edit") {
      handleUpdate(formData);
    }

  };




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "area") {
      setFormData({ ...formData, area: masterData.areas.find(a => a.id === value)! });
    } else if (name === "objective") {
      setFormData({ ...formData, objective: masterData.objectives.find(o => o.id === value)! });
    } else if (name === "status") {
      setFormData({ ...formData, status: masterData.statuses.find(s => s.id === parseInt(value))! });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg bg-gray-800 text-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-xl font-bold mb-4">
            {mode === "create" ? "Nuevo Objetivo" : "Editar Objetivo"}
          </DialogTitle>
          <div className="space-y-4">
            <form
            className="grid grid-cols-1 gap-x-6 gap-y-4"
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div>
                <label className="block text-sm text-gray-400 mb-1">Año:</label>
                <select
                  name="year"
                  value={formData.year ?? ""}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                  required={true}
                >
                  <option value="">Selecciona un año</option>
                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const prevYear = currentYear - 1;
                    const nextYear = currentYear + 1;
                    const yearsSet = new Set<number>(
                      (masterData.years ?? []).map(Number)
                    );
                    yearsSet.add(prevYear);
                    yearsSet.add(currentYear);
                    yearsSet.add(nextYear);
                    if (formData.year) yearsSet.add(Number(formData.year));
                    const years = Array.from(yearsSet).sort((a, b) => a - b);
                    return years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ));
                  })()}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-gray-400">Área:</label>
                  {canCreate && (
                    <button
                      type="button"
                      className="text-green-500 text-sm font-medium hover:underline focus:outline-none"
                      onClick={() => setShowNewAreaInput((v) => !v)}
                      title="Añadir nueva área"
                    >
                      + Nueva Área
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <select
                    name="area"
                    value={formData.area?.id ?? ""}
                    onChange={handleChange}
                    disabled={showNewAreaInput}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    required={true}
                  >
                    <option value="">Selecciona un área</option>
                    {masterData.areas.map(area => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                </div>

                {showNewAreaInput && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Nueva área"
                      value={newArea.name}
                      onChange={e => setNewArea({ ...newArea, name: e.target.value })}
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    />
                    <div className="flex justify-between mt-2">
                      <button
                        type="button"
                        className="px-2 py-1 bg-green-700 text-white rounded hover:bg-green-600"
                        onClick={handleCreateArea}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                        onClick={() => {
                          setShowNewAreaInput(false);
                          setNewArea({ id: "", name: "", description: "" });
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
                  <label className="block text-sm text-gray-400">Objetivo:</label>
                  {canCreate && (
                    <button
                      type="button"
                      className="text-green-500 text-sm font-medium hover:underline focus:outline-none"
                      onClick={() => setShowNewObjectiveInput(!showNewObjectiveInput)}
                      title="Añadir nuevo formato"
                    >
                      + Nuevo Objetivo
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <select
                    name="objective"
                    value={formData.objective?.id ?? ""}
                    onChange={handleChange}
                    disabled={showNewObjectiveInput}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    required={true}
                  >
                    <option value="">Selecciona un objetivo</option>
                    {masterData.objectives.map(obj => (
                      <option key={obj.id} value={obj.id}>{obj.name}</option>
                    ))}
                  </select>
                </div>

                {showNewObjectiveInput && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Nuevo objetivo"
                      value={newObjective.name}
                      onChange={e => setNewObjective({ ...newObjective, name: e.target.value })}
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    />
                    <div className="flex justify-between mt-2">
                      <button
                        type="button"
                        className="px-2 py-1 bg-green-700 text-white rounded hover:bg-green-600"
                        onClick={handleCreateObjective}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                        onClick={() => {
                          setShowNewObjectiveInput(false);
                          setNewObjective({ id: "", name: "", description: "" });
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}


              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre:</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                  required={true}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Descripción:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                  required={true}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Estado:</label>
                <select
                  name="status"
                  value={formData.status?.id ?? ""}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                  required={true}
                >
                  <option value="">Selecciona un estado</option>
                  {masterData.statuses.map(status => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Inicio:</label>
                  <input
                    type="date"
                    name="startIn"
                    value={formData.startIn}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    style={{ colorScheme: "dark" }}
                    required={true}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Fin:</label>
                  <input
                    type="date"
                    name="finisIn"
                    value={formData.finisIn}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    style={{ colorScheme: "dark" }}
                    required={true}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={onClose} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
                {(mode === "create" && canCreate) || (mode === "edit" && canEdit) ? (
                  <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">
                    {mode === "create" ? "Crear" : "Guardar"}
                  </button>
                ) : null}
              </div>

              {canDelete && mode === "edit" && formData.id && (
                <div className="border-t border-gray-700 pt-6 mt-8 mb-2">
                  <p
                    className="text-sm text-red-400 font-semibold mb-2 cursor-pointer hover:underline"
                    onClick={() => setShowDeleteConfirmation(true)}
                  >
                    Eliminar acción
                  </p>
                  {showDeleteConfirmation && (
                    <>
                      <p className="text-sm text-gray-400 mb-2">
                        Esta acción no se puede deshacer. Escribe{" "}
                        <span className="font-mono bg-gray-700 px-1 py-0.5 rounded">
                          {formData.id}
                        </span>{" "}
                        para confirmar.
                      </p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={confirmDeleteCode}
                          onChange={e => setConfirmDeleteCode(e.target.value)}
                          className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                        />
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={confirmDeleteCode !== formData.id}
                          className={`px-4 py-2 rounded-md transition ${confirmDeleteCode === formData.name
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
            </form>
          </div >



        </DialogPanel >
      </div >
    </Dialog >
  );
}
