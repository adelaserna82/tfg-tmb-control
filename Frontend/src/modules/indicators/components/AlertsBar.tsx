import { FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Indicator } from "../types/indicator";

interface AlertsBarProps {
  indicators: Indicator[];
}

export default function AlertsBar({ indicators }: AlertsBarProps) {

  const alertIndicators = indicators.filter((indicator) => indicator.status.id === 1);
  const errorIndicators = indicators.filter((indicator) => indicator.status.id === 2);

  return (
    <div className="absolute top-20 right-4 flex flex-wrap justify-center items-center gap-2">
      {alertIndicators.length > 0 && (
        <Link to="/indicadores/alertas" className="relative group">
          <div className="flex items-center bg-yellow-800 text-yellow-300 p-2 rounded-full shadow-md cursor-pointer hover:bg-yellow-700 transition">
            <FaExclamationTriangle />
          </div>
          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
            {alertIndicators.length} Alertas
          </span>
        </Link>
      )}

      {errorIndicators.length > 0 && (
        <Link to="/indicadores/alertas" className="relative group">
          <div className="flex items-center bg-red-800 text-red-300 p-2 rounded-full shadow-md cursor-pointer hover:bg-red-700 transition">
            <FaTimesCircle />
          </div>
          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
            {errorIndicators.length} Errores
          </span>
        </Link>
      )}
    </div>
  );
}
