import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Site } from '../types/site';
import { useCreateSite, useUpdateSite, useDeleteSite, getGetAllSitesQueryKey } from "@/api/generated/sites";
import { siteToCreateReq, siteToUpdateReq } from "../types/adapters";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";

type Mode = "create" | "edit" | null;

const initialFormData: Site = { id: "", name: "", href: "", description: "" };

interface Props {
  mode: Mode;
  setMode: (m: Mode) => void;
  formData: Site;
  setFormData: (s: Site) => void;
}

export default function SiteForm({
  mode,
  setMode,
  formData,
  setFormData,
}: Props) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmDeleteCode, setConfirmDeleteCode] = useState("");


  const { hasPermission } = useAuthStore();
  const canCreate = hasPermission(Modules.Sites, Actions.Create);
  const canEdit = hasPermission(Modules.Sites, Actions.Edit);
  const canDelete = hasPermission(Modules.Sites, Actions.Delete);  

  const createMutation = useCreateSite({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAllSitesQueryKey() });
        setFormData(initialFormData);
        setMode(null);
      },
    },
  });

  const updateMutation = useUpdateSite({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAllSitesQueryKey() });
        setFormData(initialFormData);
        setMode(null);
      },
    },
  });

  const deleteMutation = useDeleteSite({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAllSitesQueryKey() });
        setShowDeleteConfirmation(false);
        setConfirmDeleteCode("");
        setFormData(initialFormData);
        setMode(null);
      },
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (mode === "create") {
      createMutation.mutate({ data: siteToCreateReq(formData) });
    } else if (mode === "edit") {
      updateMutation.mutate({ id: formData.id, data: siteToUpdateReq(formData) });
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate({ id: formData.id });
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setMode(null);
    setShowDeleteConfirmation(false);
    setConfirmDeleteCode("");
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSave();
      }}
      className="overflow-y-auto flex-1 px-8 py-6 space-y-3"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-200">
            {mode === "edit"
            ? "Editar Sitio"
            : canCreate
            ? "Añadir nuevo sitio"
            : ""}
        </h3>
        {canCreate && mode === null && (
          <button
            type="button"
            onClick={() => setMode("create")}
            className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Nuevo
          </button>
        )}
      </div>
      {(mode === "create" || mode === "edit") && (
        <>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="url"
            name="href"
            placeholder="URL"
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
            value={formData.href}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Descripción"
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
            value={formData.description}
            onChange={handleInputChange}
          />
          <div className="flex gap-2">
            {(mode === "create" && canCreate) || (mode === "edit" && canEdit) ? (
              <button
              type="submit"
              className="w-full bg-blue-500 text-white text-sm py-2 rounded-md hover:bg-blue-600"
              >
              {mode === "edit" ? "Guardar Cambios" : "Agregar Sitio"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-600 text-white text-sm py-2 rounded-md hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
          {canDelete && mode === "edit" && formData.id && (
            <div className="border-t border-gray-700 pt-6 mt-8 mb-2">
              {!showDeleteConfirmation ? (
                <button
                  type="button"
                  className="text-sm text-red-400 font-semibold hover:underline"
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  Eliminar sitio
                </button>
              ) : (
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
                      className={`px-4 py-2 rounded-md transition ${confirmDeleteCode === formData.id
                        ? "bg-red-600 hover:bg-red-500 text-white"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirmation(false)}
                      className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </form>
  );
}