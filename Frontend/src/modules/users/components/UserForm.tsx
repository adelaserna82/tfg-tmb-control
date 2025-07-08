import { useState } from "react";
import { Role, User, UserPermission } from "../types/user";
import RoleFormDialog from "./RoleFormDialog";
import { initialFormData } from "../types/userUtils";
import { EyeIcon, EyeSlashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { getGetAllUsersQueryKey, useCreateUser, useDeleteUser, useUpdateUser } from "@/api/generated/users";
import { queryClient } from "@/lib/queryClient";
import { userToCreateReq, userToUpdateReq } from "../types/adapters";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";

interface Props {
  mode: "create" | "edit" | null;
  setMode: (m: "create" | "edit" | null) => void;
  formData: User;
  setFormData: (u: User) => void;
  availableRoles: Role[];
  availablePermissions: UserPermission[];
}

export default function UserForm({
  mode,
  setMode,
  formData,
  setFormData,
  availableRoles,
  availablePermissions,
}: Props) {
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [roleDialogMode, setRoleDialogMode] = useState<"create" | "edit">("create");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmDeleteCode, setConfirmDeleteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const { hasPermission } = useAuthStore();
  const canCreate = hasPermission(Modules.Users, Actions.Create);
  const canEdit = hasPermission(Modules.Users, Actions.Edit);
  const canDelete = hasPermission(Modules.Users, Actions.Delete);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePermission = (perm: UserPermission) => {
    const exists = formData.extraPermissions.some(p => p.module === perm.module && p.action === perm.action);
    setFormData({
      ...formData,
      extraPermissions: exists
        ? formData.extraPermissions.filter(p => !(p.module === perm.module && p.action === perm.action))
        : [...formData.extraPermissions, perm],
    });
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setMode(null);
    setPassword("");

  };


  const createMutation = useCreateUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
        handleCancel();
      },
    },
  });

  const updateMutation = useUpdateUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
        handleCancel();
      },
    },
  });

  const deleteMutation = useDeleteUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
        handleCancel();
      },
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({ id: formData.id });
  };

  const handleSave = () => {
    if (mode === "create") {
      createMutation.mutate({ data: userToCreateReq(formData, password) });
    } else if (mode === "edit") {
      updateMutation.mutate({ id: formData.id, data: userToUpdateReq(formData, password) });
    }
  };
  return (
    <>
      <div className="flex items-center justify-between mb-2 text-gray-300">
        <h3 className="text-lg font-semibold">
          {mode === "edit"
            ? "Editar usuario"
            : canCreate
              ? "Añadir nuevo usuario"
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
        <form
          className="overflow-y-auto flex-1 px-8 py-6 space-y-3 text-gray-300"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-700 rounded"
            />
            <label htmlFor="isActive" className="text-sm text-gray-200">
              Usuario activo
            </label>
          </div>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
            required={true}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
            required={true}
          />
          <input
            type="text"
            name="mobile"
            placeholder="Móvil"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
            required={true}
          />
          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
            required={true}
          />

          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Rol asignado</label>
              <div className="flex gap-4">
                {canCreate && (
                  <button
                    type="button"
                    onClick={() => {
                      setRoleDialogMode("create");
                      setShowRoleDialog(true);
                    }}
                    className="text-xs text-green-400 hover:underline"
                  >
                    + Nuevo Rol
                  </button>
                )}

                {formData.roleId && (
                  <button
                    type="button"
                    onClick={() => {
                      setRoleDialogMode("edit");
                      setShowRoleDialog(true);
                    }}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Editar Rol
                  </button>
                )}
              </div>
            </div>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
              required={true}
            >
              <option value="">Seleccionar rol</option>
              {availableRoles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña (opcional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>



          <fieldset className="mb-4">
            <legend className="text-sm font-semibold mb-1">Permisos adicionales</legend>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto text-sm">
              {availablePermissions
                .filter(perm => {
                  const selectedRole = availableRoles.find(r => r.id === formData.roleId);
                  const roleHasPermission = selectedRole?.permissions.some(p =>
                    p.module === perm.module && p.action === perm.action
                  );
                  return !roleHasPermission;
                })
                .map((perm) => {
                  const isChecked = formData.extraPermissions.some(p => p.module === perm.module && p.action === perm.action);
                  return (
                    <label key={`${perm.module}-${perm.action}`} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePermission(perm)}
                      />
                      {perm.module} → {perm.action}
                    </label>
                  );
                })}
            </div>
          </fieldset>

          <div className="flex gap-2">
            {(mode === "create" ? canCreate : canEdit) && (
              <button
              type="submit"
              className="w-full bg-blue-500 text-white text-sm py-2 rounded-md hover:bg-blue-600"
              >
              {mode === "edit" ? "Guardar cambios" : "Crear usuario"}
              </button>
            )}
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
                  Eliminar usuario
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
                      onChange={(e) => setConfirmDeleteCode(e.target.value)}
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                      placeholder="Escribe el ID del usuario"
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
                      onClick={() => {
                        setShowDeleteConfirmation(false);
                        setConfirmDeleteCode("");
                      }}
                      className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </form>
      )}

      {showRoleDialog && (
        <RoleFormDialog
          mode={roleDialogMode}
          roleToEdit={
            roleDialogMode === "edit"
              ? availableRoles.find(r => r.id === formData.roleId)
              : undefined
          }
          availablePermissions={availablePermissions}
          onClose={() => setShowRoleDialog(false)}
          onCreatedOrUpdated={(updatedRole) => {
            setFormData({ ...formData, roleId: updatedRole.id });
          }}
        />
      )}


    </>
  );
}
