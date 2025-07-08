import { JSX } from "react";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

interface CommunicationStatus {
  id: number;
  name: string;
  color: string;
  icon: JSX.Element;
}

const STATUS_MAP: Record<number, CommunicationStatus> = {
  1: {
    id: 1,
    name: "Atendiendo",
    color: "text-blue-400",
    icon: <FaClock className="text-blue-400" />,
  },
  2: {
    id: 2,
    name: "Pendiente",
    color: "text-yellow-400",
    icon: <FaClock className="text-yellow-400" />,
  },
  3: {
    id: 3,
    name: "Finalizado",
    color: "text-green-400",
    icon: <FaCheckCircle className="text-green-400" />,
  },

  4: {
    id: 4,
    name: "Cancelado",
    color: "text-red-400",
    icon: <FaTimesCircle className="text-red-400" />,
  },
};

interface CommunicationStatusBadgeProps {
  statusId: number;
}

export function CommunicationStatusBadge({ statusId }: CommunicationStatusBadgeProps) {
  const status = STATUS_MAP[statusId];

  return (
    <span className="flex items-center px-3 py-1 text-sm font-medium rounded-full bg-opacity-30">
      {status ? status.icon : <FaClock className="text-gray-400" />}
      <span className="ml-2">{status ? status.name : "Desconocido"}</span>
    </span>
  );
}
