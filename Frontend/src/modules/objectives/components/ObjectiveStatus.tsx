import { JSX } from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";

interface ObjectiveStatus {
  id: number;
  name: string;
  color: string;
  icon: JSX.Element;
}

const STATUS_MAP: Record<number, ObjectiveStatus> = {

  1: {
    id: 1,
    name: "Pendiente",
    color: "text-yellow-400",
    icon: <FaClock className="text-yellow-400" />,
  },
  2: {
    id: 2,
    name: "En curso",
    color: "text-blue-400",
    icon: <FaClock className="text-blue-400" />,
  },
  3: {
    id: 3,
    name: "Finalizado",
    color: "text-green-400",
    icon: <FaCheckCircle className="text-green-400" />,
  }
};

interface ObjectiveStatusBadgeProps {
  statusId: number;
}

export function ObjectiveStatusBadge({ statusId }: ObjectiveStatusBadgeProps) {
  const status = STATUS_MAP[statusId];

  return (
    <span className="flex items-center px-3 py-1 text-sm font-medium rounded-full bg-opacity-30">
      {status ? status.icon : <FaClock className="text-gray-400" />}
      <span className="ml-2">{status ? status.name : "Desconocido"}</span>
    </span>
  );
}
