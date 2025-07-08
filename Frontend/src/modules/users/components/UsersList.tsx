import { PencilIcon } from "@heroicons/react/24/outline";
import { User } from "../types/user";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
}

export default function UsersList({ users, onEdit }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition flex justify-between items-center"
        >
          <div className="flex-grow">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <p className="text-gray-500 text-xs italic">{user.roleName}</p>
          </div>
          <button onClick={() => onEdit(user)} className="text-gray-400 hover:text-blue-400 ml-2">
            <PencilIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
