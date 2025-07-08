import { Dialog, DialogPanel, DialogBackdrop, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { getGetUserMasterDataQueryKey, useCreateRole } from "@/api/generated/users";
import { roleToCreateReq } from "../types/adapters";
import { Role, UserPermission } from "../types/user";
import { useUpdateRole } from "@/api/generated/users";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";


interface Props {
    mode: "create" | "edit";
    onClose: () => void;
    onCreatedOrUpdated: (role: Role) => void;
    availablePermissions: UserPermission[];
    roleToEdit?: Role;
}

export default function RoleFormDialog({
    onClose,
    onCreatedOrUpdated,
    availablePermissions,
    roleToEdit,
    mode
}: Props) {
    const [name, setName] = useState(roleToEdit?.name ?? "");
    const [code, setCode] = useState(roleToEdit?.code ?? "");
    const [selectedPermissions, setSelectedPermissions] = useState<UserPermission[]>(
        roleToEdit?.permissions ?? []
    );

    const { hasPermission } = useAuthStore();
    const canCreate = hasPermission(Modules.Users, Actions.Create);
    const canEdit = hasPermission(Modules.Users, Actions.Edit);
    const canDelete = hasPermission(Modules.Users, Actions.Delete);

    const togglePermission = (perm: UserPermission) => {
        const exists = selectedPermissions.some(
            (p) => p.module === perm.module && p.action === perm.action
        );
        setSelectedPermissions(
            exists
                ? selectedPermissions.filter(
                    (p) => !(p.module === perm.module && p.action === perm.action)
                )
                : [...selectedPermissions, perm]
        );
    };

    const createMutation = useCreateRole({
        mutation: {
            onSuccess: (res) => {
                queryClient.invalidateQueries({ queryKey: getGetUserMasterDataQueryKey() });
                onCreatedOrUpdated({
                    id: res.data.id ?? "",
                    name: res.data.name ?? "",
                    code: res.data.code ?? "",
                    permissions: selectedPermissions,
                });
                onClose();
            },
        },
    });

    const updateMutation = useUpdateRole({
        mutation: {
            onSuccess: (res) => {
                queryClient.invalidateQueries({ queryKey: getGetUserMasterDataQueryKey() });
                onCreatedOrUpdated({
                    id: res.data.id ?? "",
                    name: res.data.name ?? "",
                    code: res.data.code ?? "",
                    permissions: selectedPermissions,
                });
                onClose();
            },
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            id: "",
            name,
            code,
            permissions: selectedPermissions,
        };

        if (mode === "create") {
            createMutation.mutate({ data: roleToCreateReq(payload) });
        } else {
            if (!roleToEdit) return;
            updateMutation.mutate({
                id: roleToEdit.id,
                data: roleToCreateReq({ ...payload, id: roleToEdit.id }),
            });
        }
    };


    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-lg bg-gray-800 text-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
                    <div className="px-8 pt-8 pb-4 border-b border-gray-700">
                        <DialogTitle className="text-xl font-bold">
                            {mode === "create" ? "Crear nuevo rol" : "Editar rol"}
                        </DialogTitle>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="overflow-y-auto flex-1 px-8 py-6 space-y-6"
                    >
                        <input
                            type="text"
                            placeholder="Nombre del rol"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                            required={true}
                        />
                        <input
                            type="text"
                            placeholder="Código (ej: admin)"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                            required={true}
                        />
                        <fieldset>
                            <legend className="text-sm font-semibold mb-1">
                                Permisos del rol
                            </legend>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto text-sm">
                                {availablePermissions.map((perm) => {
                                    const isChecked = selectedPermissions.some(
                                        (p) =>
                                            p.module === perm.module && p.action === perm.action
                                    );
                                    return (
                                        <label
                                            key={`${perm.module}-${perm.action}`}
                                            className="flex items-center gap-2"
                                        >
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
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
                            >
                                Cancelar
                            </button>
                            {(mode === "create" ? canCreate : canEdit) && (
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm"
                                >
                                    {mode === "create" ? "Crear rol" : "Guardar cambios"}
                                </button>
                            )}

                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
