import { FaSearch } from "react-icons/fa";
import { Filters } from "../types/filters";
import { MasterData } from "../types/operationalControl";

interface Props {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  isExpanded: boolean;
  masterData: MasterData;
}

export default function OperationalControlFilters({ filters, onFilterChange, isExpanded, masterData }: Props) {
  const toggleStatus = (statusId: number) => {
    const updated = filters.status.includes(statusId)
      ? filters.status.filter(s => s !== statusId)
      : [...filters.status, statusId];

    onFilterChange({ ...filters, status: updated });
  };

  return (
    <div className={`p-4 rounded-md w-full transition-all duration-300 ${isExpanded ? "hidden" : "block"}`}>
      <h3 className="font-semibold text-lg text-gray-100">Control Operacional</h3>

      <div className="relative mt-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={filters.searchText}
          onChange={(e) => onFilterChange({ ...filters, searchText: e.target.value })}
          className="w-full p-2 pl-10 border rounded-md bg-gray-800 text-gray-200 border-gray-700"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      <label className="block mt-4 text-sm font-medium text-gray-300">Grupo</label>
      <select
        className="w-full p-2 border rounded-md mt-1 bg-gray-800 text-gray-200 border-gray-700"
        value={filters.group}
        onChange={(e) => onFilterChange({ ...filters, group: Number(e.target.value) })}
      >
        <option value="">Seleccionar...</option>
        {masterData.groups.map(group => (
          <option key={group.id} value={group.id}>{group.name}</option>
        ))}
      </select>

      <label className="block mt-4 text-sm font-medium text-gray-300">Frecuencia</label>
      <select
        className="w-full p-2 border rounded-md mt-1 bg-gray-800 text-gray-200 border-gray-700"
        value={filters.frequency}
        onChange={(e) => onFilterChange({ ...filters, frequency: Number(e.target.value) })}
      >
        <option value="">Seleccionar...</option>
        {masterData.frequencies.map(freq => (
          <option key={freq.id} value={freq.id}>{freq.name}</option>
        ))}
      </select>

      <label className="block mt-4 text-sm font-medium text-gray-300">Situación</label>
      {masterData.statuses.map(status => (
        <div key={status.id} className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={filters.status.includes(status.id)}
            onChange={() => toggleStatus(status.id)}
            className="mr-2"
          />
          <span
            className="text-gray-200 cursor-pointer"
            onClick={() => toggleStatus(status.id)}
          >
            {status.name}
          </span>
        </div>
      ))}

      <label className="block mt-4 text-sm font-medium text-gray-300">Año de Próxima Revisión</label>
      <select
        className="w-full p-2 border rounded-md mt-1 bg-gray-800 text-gray-200 border-gray-700"
        value={filters.year}
        onChange={(e) => onFilterChange({ ...filters, year: Number(e.target.value) })}
      >
        <option value="">Seleccionar...</option>
        {[...Array(5)].map((_, i) => {
          const year = new Date().getFullYear() - i;
          return (
            <option key={year} value={year}>
              {year}
            </option>
          );
        })}
      </select>
    </div>
  );
}
