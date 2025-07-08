import { Dialog, DialogPanel, DialogBackdrop, DialogTitle, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import { Communication, MasterData, Format, Origin } from "../types/communication";
import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { getGetAllCommunicationsQueryKey, getGetCommunicationMasterDataQueryKey, useCreateCommunication, useCreateFormat, useCreateOrigin, useDeleteCommunication, useUpdateCommunication } from "@/api/generated/communications";
import { communicationFormatToCreateReq, communicationOriginToCreateReq, communicationToUpdateReq } from "../types/adapters";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";

interface CommunicationFormDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit" | null;
  communication: Communication;
  masterData: MasterData;
  communicationsWithOutFilters?: Communication[];
}

export default function CommunicationFormDialog({
  open,
  onClose,
  mode,
  communication,
  masterData,
  communicationsWithOutFilters = [],
}: CommunicationFormDialogProps) {
  const [showNewOriginInput, setShowNewOriginInput] = useState(false);
  const [newOrigin, setNewOrigin] = useState<Origin>({ id: 0, name: "" });
  const [showNewFormatInput, setShowNewFormatInput] = useState(false);
  const [newFormat, setNewFormat] = useState<Format>({ id: 0, name: "" });
  const [query, setQuery] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmDeleteCode, setConfirmDeleteCode] = useState("");
  const [formComm, setFormComm] = useState<Communication>(communication);


  const { hasPermission } = useAuthStore();
  const canCreate = hasPermission(Modules.Communications, Actions.Create);
  const canEdit = hasPermission(Modules.Communications, Actions.Edit);
  const canDelete = hasPermission(Modules.Communications, Actions.Delete);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formComm) return;
    const { name, value } = e.target;
    if (name === "category") {
      setFormComm({ ...formComm, category: masterData.categories.find(c => c.id === Number(value))! });
    } else if (name === "origin") {
      setFormComm({ ...formComm, origin: masterData.origins.find(o => o.id === Number(value))! });
    } else if (name === "format") {
      setFormComm({ ...formComm, format: masterData.formats.find(f => f.id === Number(value))! });
    } else if (name === "status") {
      setFormComm({ ...formComm, status: masterData.statuses.find(s => s.id === Number(value))! });
    }
    else {
      setFormComm({ ...formComm, [name]: value });
    }
  };

  const filteredParents = query === ""
    ? communicationsWithOutFilters.filter(c => !c.relatedId && c.id !== formComm?.id)
    : communicationsWithOutFilters
      .filter(c => !c.relatedId && c.id !== formComm?.id)
      .filter(c =>
        `${c.origin.name} ${c.description} ${new Date(c.date).toLocaleDateString("es-ES")}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );

  const createFormatMutation = useCreateFormat({
    mutation: {
      onSuccess: (response) => {
        const { data: id } = response;
        const f: Format = { id: id, name: newFormat.name };
        setFormComm({ ...formComm!, format: f });
        setNewFormat({ id: 0, name: "" });
        setShowNewFormatInput(false);
        queryClient.invalidateQueries({
          queryKey: getGetCommunicationMasterDataQueryKey(),
        });
      }
    }
  });


  const handleCreateFormat = () => {
    if (!newFormat.name.trim()) return;
    createFormatMutation.mutate({ data: communicationFormatToCreateReq(newFormat) });
  };

  const hasChildren = (): boolean => {
    if (!formComm) return false;
    return communicationsWithOutFilters.some(c => c.relatedId === formComm.id);
  }

  const createOriginMutation = useCreateOrigin({
    mutation: {
      onSuccess: (response) => {
        const { data: id } = response;
        const o: Origin = { id: id, name: newOrigin.name };
        setFormComm({ ...formComm!, origin: o });
        setNewOrigin({ id: 0, name: "" });
        setShowNewOriginInput(false);
        queryClient.invalidateQueries({
          queryKey: getGetCommunicationMasterDataQueryKey(),
        });
      }
    }
  });

  const handleCreateOrigin = () => {
    if (!newOrigin.name.trim()) return;
    createOriginMutation.mutate({ data: communicationOriginToCreateReq(newOrigin) });

  };



  const createMutation = useCreateCommunication({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAllCommunicationsQueryKey(),
        });
        onClose();
      },
    },
  });

  const updateMutation = useUpdateCommunication({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAllCommunicationsQueryKey(),
        });
        onClose();
      },
    },
  });

  const deleteMutation = useDeleteCommunication({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAllCommunicationsQueryKey(),
        });
        onClose();
      }
    },
  });


  const handleCreate = (comm: Communication) => {
    createMutation.mutate({
      data: communicationToUpdateReq(comm),
    });
  };

  const handleUpdate = (comm: Communication) => {
    updateMutation.mutate({
      id: comm.id,
      data: communicationToUpdateReq(comm),
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate({
      id: formComm.id,
    });
  };

  const handleSave = () => {
    if (mode === "create") {
      handleCreate(formComm);
    } else if (mode === "edit") {
      handleUpdate(formComm);
    }

  };


  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg bg-gray-800 text-white rounded-xl shadow-2xl p-0 max-h-[90vh] flex flex-col">
          <div className="px-8 pt-8 pb-4 border-b border-gray-700">
            <DialogTitle className="text-xl font-bold">
              {mode === "create" ? "Nueva Comunicación" : "Editar Comunicación"}
            </DialogTitle>
          </div>
          <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6">

            {!hasChildren() && (
              <>
                {formComm?.related && (
                  <div className="md:col-span-2 text-sm text-blue-400 border-l-4 border-blue-500 bg-blue-900 p-3 rounded">
                    Este documento será creado como hijo del documento del{" "}
                    <strong>{new Date(formComm.related.date).toLocaleDateString("es-ES")}</strong>:
                    <br />
                    <em>{formComm.related.description}</em>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Documento padre (opcional):</label>
                  <Combobox
                    value={formComm?.related}
                    onChange={(value) => {
                      if (!value) {
                        setFormComm({ ...formComm!, relatedId: null, related: null } as Communication);
                      } else {
                        setFormComm({ ...formComm!, relatedId: value.id, related: value } as Communication);
                      }
                    }}
                  >
                    <div className="relative">
                      <ComboboxInput
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                        displayValue={(comm: Communication) =>
                          comm ? `${new Date(comm.date).toLocaleDateString("es-ES")} ${comm.origin.name} | ${comm.description}` : ""
                        }
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar documento padre..."
                      />

                      <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <ComboboxOption
                          value={null}
                          className={({ focus }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${focus ? "bg-gray-700 text-white" : "text-gray-300"
                            }`
                          }
                        >
                          Ninguno (documento raíz)
                        </ComboboxOption>

                        {filteredParents.map((comm) => (
                          <ComboboxOption
                            key={comm.id}
                            value={comm}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-gray-700 text-white" : "text-gray-300"
                              }`
                            }
                          >
                            [{new Date(comm.date).toLocaleDateString("es-ES")}] {comm.origin.name} | {comm.description}
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    </div>
                  </Combobox>
                </div>

              </>

            )}

            {formComm && (
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
                onSubmit={e => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tipo:</label>
                  <select
                    name="category"
                    value={formComm?.category?.id ?? ""}
                    onChange={handleFormChange}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    required={true}
                  >
                    <option value="">Selecciona un tipo</option>
                    {masterData.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm text-gray-400">Origen:</label>
                    {canCreate && (
                      <button
                        type="button"
                        className="text-green-500 text-sm font-medium hover:underline focus:outline-none"
                        onClick={() => setShowNewOriginInput((v) => !v)}
                        title="Añadir nuevo origen"
                      >
                        + Nuevo origen
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <select
                      name="origin"
                      value={formComm?.origin?.id ?? ""}
                      onChange={handleFormChange}
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                      disabled={showNewOriginInput}
                      required={true}
                    >
                      <option value="">Selecciona un origen</option>
                      {masterData.origins.map((origin) => (
                        <option key={origin.id} value={origin.id}>
                          {origin.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {showNewOriginInput && (
                    <div className="mt-2 md:col-span-2">
                      <input
                        type="text"
                        placeholder="Nuevo origen"
                        value={newOrigin?.name ?? ""}
                        onChange={e => setNewOrigin({ ...newOrigin, name: e.target.value })}
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                      />
                      <div className="flex justify-between mt-2">
                        <button
                          type="button"
                          className="px-2 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-600"
                          onClick={handleCreateOrigin}
                        >
                          Crear origen
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                          onClick={() => {
                            setShowNewOriginInput(false);
                            setNewOrigin({ id: 0, name: "" });
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Fecha:</label>
                  <input
                    type="date"
                    name="date"
                    value={formComm.date}
                    onChange={handleFormChange}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    style={{ colorScheme: "dark" }}
                    required={true}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm text-gray-400">Formato:</label>
                    {canCreate && (
                      <button
                        type="button"
                        className="text-green-500 text-sm font-medium hover:underline focus:outline-none"
                        onClick={() => setShowNewFormatInput((v) => !v)}
                        title="Añadir nuevo formato"
                      >
                        + Nuevo formato
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <select
                      name="format"
                      value={formComm.format?.id ?? ""}
                      onChange={handleFormChange}
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                      disabled={showNewFormatInput}
                      required={true}
                    >
                      <option value="">Selecciona un formato</option>
                      {masterData.formats.map((format) => (
                        <option key={format.id} value={format.id}>
                          {format.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {showNewFormatInput && (
                    <div className="mt-2 md:col-span-2">
                      <input
                        type="text"
                        placeholder="Nuevo formato"
                        value={newFormat?.name ?? ""}
                        onChange={e => setNewFormat({ ...newFormat, name: e.target.value })}
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                      />
                      <div className="flex justify-between mt-2">
                        <button
                          type="button"
                          className="px-2 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-600"
                          onClick={handleCreateFormat}
                        >
                          Crear formato
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                          onClick={() => {
                            setShowNewFormatInput(false);
                            setNewFormat({ id: 0, name: "" });
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Responsables:</label>
                  <select
                    name="responsibles"
                    value={formComm?.responsibles?.map(r => r.id) ?? []}
                    onChange={e => {
                      const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
                      setFormComm({
                        ...formComm,
                        responsibles: masterData.responsibles.filter(r => selectedOptions.includes(r.id)),
                      });
                    }}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    multiple
                  >
                    {masterData.responsibles.map((responsible) => (
                      <option key={responsible.id} value={responsible.id}>
                        {responsible.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Estado:</label>
                  <select
                    name="status"
                    value={formComm?.status?.id ?? ""}
                    onChange={handleFormChange}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    required={true}
                  >
                    <option value="">Selecciona un estado</option>
                    {masterData.statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Fecha plazo:</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formComm.dueDate ?? undefined}
                    onChange={handleFormChange}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Descripción:</label>
                  <textarea
                    name="description"
                    value={formComm?.description ?? ""}
                    onChange={handleFormChange}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Ruta del fichero:</label>
                  <input
                    type="text"
                    name="filePath"
                    value={formComm?.filePath ?? ""}
                    onChange={handleFormChange}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  {mode === "create" && canCreate && (
                    <button
                      type="submit"
                      className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500"
                    >
                      Crear
                    </button>
                  )}
                  {mode === "edit" && canEdit && (
                    <button
                      type="submit"
                      className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500"
                    >
                      Guardar
                    </button>
                  )}
                </div>
              </form>
            )}
            {canDelete && mode === "edit" && formComm?.id && (
              <div className="border-t border-gray-700 pt-6 mt-8 mb-2">
                <p
                  className="text-sm text-red-400 font-semibold mb-2 cursor-pointer hover:underline"
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  Eliminar comunicación
                </p>
                {showDeleteConfirmation && (
                  <>
                    <p className="text-sm text-gray-400 mb-2">
                      Esta acción no se puede deshacer. Escribe{" "}
                      <span className="font-mono bg-gray-700 px-1 py-0.5 rounded">
                        {formComm.id}
                      </span>{" "}
                      para confirmar.
                    </p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Escribe el ID de la comunicación"
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                        value={confirmDeleteCode}
                        onChange={e => setConfirmDeleteCode(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={confirmDeleteCode !== formComm.id}
                        className={`px-4 py-2 rounded-md transition ${confirmDeleteCode === formComm.id
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
        </DialogPanel>
      </div>
    </Dialog>
  );
}