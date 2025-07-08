import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Indicator } from "../types/indicator";
import { Category } from "../types/category";
import { getGetIndicatorMasterDataQueryKey, getGetIndicatorsByCategoryWithHistoryQueryKey, useCreateCategory, useCreateIndicator, useDeleteIndicator, useUpdateIndicator } from "@/api/generated/indicators";
import { queryClient } from "@/lib/queryClient";
import { indicatorCategoryToCreateReq, indicatorToCreateReq, indicatorToUpdateReq } from "../types/adapters";
import { MasterData } from "../types/masterData";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";


type ConfigurationModalProps = {
  showConfig: boolean;
  setShowConfig: (show: boolean) => void;
  indicator: Indicator;
  categoryFilter: number;
  masterData: MasterData;
};

export default function ConfigurationModal({ showConfig, setShowConfig, indicator, categoryFilter, masterData }: ConfigurationModalProps) {
  const [formData, setFormData] = useState<Indicator | null>(indicator);
  const [newCategory, setNewCategory] = useState<Category>({
    id: 0,
    name: "",
    description: "",
    order: 0,
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { hasPermission } = useAuthStore();


  const canDelete = hasPermission(Modules.Indicators, Actions.Delete)
  const canEdit = hasPermission(Modules.Indicators, Actions.Edit)
  const canCreate = hasPermission(Modules.Indicators, Actions.Create)


  useEffect(() => {
    setFormData(indicator);
    setConfirmCode("");
    setShowDeleteConfirmation(false);
  }, [indicator]);

  if (!formData) return null;

  const handleChange = (field: keyof Indicator, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const createCategoryMutation = useCreateCategory({
    mutation: {
      onSuccess: (response) => {
        console.log("Category created successfully", response);

        const { data: id } = response;
        const c: Category = { id: id, name: newCategory.name, description: newCategory.description, order: masterData.categories.length + 1 };
        setFormData({ ...formData, category: c });
        setNewCategory({
          id: 0,
          name: "",
          description: "",
          order: 0,
        });
        setIsAddingCategory(false);
        queryClient.invalidateQueries({
          queryKey: getGetIndicatorMasterDataQueryKey(),
        });
      }
    }
  });

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    createCategoryMutation.mutate({
      data: indicatorCategoryToCreateReq(newCategory),
    });
  };

  const updateMutation = useUpdateIndicator({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetIndicatorsByCategoryWithHistoryQueryKey(categoryFilter),
        });
        setShowConfig(false);
      },
    },
  });

  const createMutation = useCreateIndicator({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetIndicatorsByCategoryWithHistoryQueryKey(categoryFilter),
        });
        setShowConfig(false);
      },
    },
  });

  const deleteMutation = useDeleteIndicator({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetIndicatorsByCategoryWithHistoryQueryKey(categoryFilter),
        });
        setShowConfig(false);
      },
    },
  });

  const handleClose = () => {
    setShowConfig(false);
  };

  const handleSave = () => {
    if (!formData.id) {
      createMutation.mutate({
        data: indicatorToCreateReq(formData),
      });
    } else {
      updateMutation.mutate({
        id: formData.id,
        data: indicatorToUpdateReq(formData),
      });
    }
  };

  const handleDelete = () => {
    if (formData.id) {
      deleteMutation.mutate({
        id: formData.id,
      });
    }
  };

  return (
    <Dialog open={showConfig} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4  sm:p-0">
        <DialogPanel className="w-full max-w-lg bg-gray-800 text-white rounded-xl shadow-2xl p-0 max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
            <DialogTitle as="h3" className="text-lg font-semibold">{formData.name || "Nuevo Indicador"}</DialogTitle>
            <button type="button" onClick={handleClose} className="text-gray-300 hover:text-white transition">✕</button>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }} className="flex flex-col h-full overflow-y-auto">
            <div className="flex-1 px-8 py-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400">Código:</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    required={true}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400">Nombre:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    required={true}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400">Descripción:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm text-gray-400">Categoría:</label>
                  {canCreate && (
                    <button
                      type="button"
                      className="text-green-500 text-sm font-medium hover:underline focus:outline-none"
                      onClick={() => setIsAddingCategory(!isAddingCategory)}
                      title="Añadir nueva categoría"
                    >
                      + Añadir nueva categoría
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <select
                    value={formData.category.id}
                    onChange={(e) => {
                      const selected = masterData.categories.find(cat => cat.id === Number(e.target.value));
                      if (selected) handleChange("category", selected);
                    }}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    disabled={isAddingCategory}
                    required={true}
                  >
                    <option value="">Seleccionar categoría</option>
                    {masterData.categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {isAddingCategory && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Nueva categoría"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    />
                    <div className="flex justify-between mt-2">
                      <button
                        type="button"
                        className="px-2 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-600"
                        onClick={handleAddCategory}
                      >
                        Crear categoría
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                        onClick={() => {
                          setIsAddingCategory(false);
                          setNewCategory({
                            id: 0,
                            name: "",
                            description: "",
                            order: 0,
                          });
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400">Frecuencia:</label>
                <select
                  value={formData.frequency.id}
                  onChange={(e) => {
                    const selected = masterData.frequencies.find(freq => freq.id === Number(e.target.value));
                    if (selected) handleChange("frequency", selected);
                  }}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                  required={true}
                >
                  <option value="">Seleccionar frecuencia</option>
                  {masterData.frequencies.map((frequency) => (
                    <option key={frequency.id} value={frequency.id}>{frequency.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400">Unidad:</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => handleChange("unit", e.target.value)}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Mínimo:</label>
                  <input
                    type="number"
                    value={formData.min}
                    onChange={(e) => handleChange("min", Number(e.target.value))}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Máximo:</label>
                  <input
                    type="number"
                    value={formData.max}
                    onChange={(e) => handleChange("max", Number(e.target.value))}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={formData.isErrorConfigured}
                    onChange={(e) => handleChange("isErrorConfigured", e.target.checked)}
                    className="form-checkbox bg-gray-700"
                  />
                  <span>Configurar límites de error</span>
                </label>

                {formData.isErrorConfigured && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <input type="number" value={formData.minError} onChange={(e) => handleChange("minError", Number(e.target.value))} className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white" placeholder="Mín. Error" />
                    <input type="number" value={formData.maxError} onChange={(e) => handleChange("maxError", Number(e.target.value))} className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white" placeholder="Máx. Error" />
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={formData.isAlertConfigured}
                    onChange={(e) => handleChange("isAlertConfigured", e.target.checked)}
                    className="form-checkbox bg-gray-700"
                  />
                  <span>Configurar límites de alerta</span>
                </label>

                {formData.isAlertConfigured && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <input type="number" value={formData.minAlert} onChange={(e) => handleChange("minAlert", Number(e.target.value))} className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white" placeholder="Mín. Alerta" />
                    <input type="number" value={formData.maxAlert} onChange={(e) => handleChange("maxAlert", Number(e.target.value))} className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white" placeholder="Máx. Alerta" />
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 flex justify-end space-x-2">
              <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600">Cancelar</button>
              {formData.id && canEdit && (
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">Guardar</button>
              )}

              {!formData.id && canCreate && (
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">Crear</button>
              )}
            </div>

            {formData.id && canDelete && (
              <div className="border-t border-gray-700 p-4">
                <p
                  className="text-sm text-red-400 font-semibold mb-2 cursor-pointer hover:underline"
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  Eliminar indicador
                </p>

                {showDeleteConfirmation && (
                  <>
                    <p className="text-sm text-gray-400 mb-2">
                      Esta acción no se puede deshacer. Escribe{" "}
                      <span className="font-mono bg-gray-700 px-1 py-0.5 rounded">
                        {formData.code}
                      </span>{" "}
                      para confirmar.
                    </p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Escribe el código del indicador"
                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                        value={confirmCode}
                        onChange={(e) => setConfirmCode(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={confirmCode !== formData.code}
                        className={`px-4 py-2 rounded-md transition ${confirmCode === formData.code
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

        </DialogPanel>
      </div>
    </Dialog>
  );
}
