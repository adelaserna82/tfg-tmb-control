import { useState } from "react";
import UsersList from "./components/UsersList";
import UserForm from "./components/UserForm";
import { useGetAllUsers, useGetUserMasterData } from "@/api/generated/users";
import { masterDtoToMaster, userDtoToUser } from "./types/adapters";
import { User } from "./types/user";
import UsersSkeleton from "./components/skeletons/UsersSkeleton";
import UserFormSkeleton from "./components/skeletons/UserFormSkeleton";
import { initialFormData } from "./types/userUtils";
import { Dialog } from "@headlessui/react";
import { FaCompress } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

type Mode = "create" | "edit" | null;

export default function UsersPage() {
  const [mode, setMode] = useState<Mode>(null);
  const [formData, setFormData] = useState<User>(initialFormData);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: resp, isLoading } = useGetAllUsers();
  const { data: respMasterData } = useGetUserMasterData();

  const allUsers = (resp?.data ?? []).map(userDtoToUser);
  const masterData = masterDtoToMaster(respMasterData?.data ?? {});
  const roles = masterData?.roles ?? [];
  const permissions = masterData?.permissions ?? [];

  const handleEditUser = (user: User) => {
    setMode("edit");
    setFormData(user);
    setDrawerOpen(true);
  };

  const handleNewUser = () => {
    setMode("create");
    setFormData(initialFormData);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
      </div>
      <div className="flex p-6 bg-gray-900 text-white rounded-lg shadow-lg min-h-[50vh] relative">
        <button
          onClick={handleNewUser}
          className="md:hidden fixed bottom-8 right-8 z-20 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
          aria-label="Nuevo usuario"
        >
          <FaPlus/>
        </button>
        <div className="flex-1 pr-1 md:pr-6 md:border-r border-gray-700 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {isLoading ? (
            <UsersSkeleton />
          ) : allUsers.length === 0 ? (
            <p className="text-gray-400 text-sm text-center">No hay usuarios disponibles.</p>
          ) : (
            <UsersList users={allUsers} onEdit={handleEditUser} />
          )}
        </div>
        <div className="w-1/3 pl-6 hidden md:block">
          {isLoading ? (
            <UserFormSkeleton />
          ) : (
            <UserForm
              mode={mode}
              setMode={setMode}
              formData={formData}
              setFormData={setFormData}
              availableRoles={roles}
              availablePermissions={permissions}
            />
          )}
        </div>
      </div>
      <Dialog open={drawerOpen} onClose={() => setDrawerOpen(false)} className="relative z-50 md:hidden">
        <div
          className="fixed inset-0 bg-black/30"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-gray-900 p-4 overflow-y-auto shadow-xl">
          <button
            className="mb-4 text-white ml-auto flex justify-end"
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar formulario"
          >
            <span className="sr-only">Cerrar formulario</span>
            <FaCompress className="text-lg rotate-45" />
          </button>
          <UserForm
            mode={mode}
            setMode={(m) => {
              setMode(m);
              if (!m) setDrawerOpen(false);
            }}
            formData={formData}
            setFormData={setFormData}
            availableRoles={roles}
            availablePermissions={permissions}
          />
        </div>
      </Dialog>
    </>
  );
}