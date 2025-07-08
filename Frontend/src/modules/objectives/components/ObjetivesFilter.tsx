import { FaSearch } from "react-icons/fa";
import { Filters } from "../types/fiters";
import { MasterData } from "../types/action";

interface Props {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  masterData: MasterData;
  isExpanded?: boolean;
}

export default function ObjectivesFilters({ filters, onFilterChange, masterData, isExpanded = false }: Props) {
  return (
    <div className={`p-4 rounded-md w-full transition-all duration-300 ${isExpanded ? "hidden" : "block"} text-gray-200`}>
      <h3 className="font-semibold text-lg">Filtrar Objetivos</h3>

      <label className="block mt-4 text-sm font-medium text-gray-300">Búsqueda</label>
      <div className="relative mt-1">
        <input
          type="text"
          placeholder="Buscar..."
          value={filters.searchText}
          onChange={(e) => onFilterChange({ ...filters, searchText: e.target.value })}
          className="w-full p-2 pl-10 border rounded-md bg-gray-800 text-gray-200 border-gray-700"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      <label className="block mt-4 text-sm font-medium text-gray-300">Año</label>
      <select
        className="w-full p-2 border rounded-md mt-1 bg-gray-800 text-gray-200 border-gray-700"
        value={filters.year}
        onChange={(e) => onFilterChange({ ...filters, year: Number(e.target.value) })}
      >
        <option value="">Seleccionar...</option>
        {masterData.years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <label className="block mt-4 text-sm font-medium text-gray-300">Área</label>
      <select
        className="w-full p-2 border rounded-md mt-1 bg-gray-800 text-gray-200 border-gray-700"
        value={filters.area ?? ""}
        onChange={(e) => onFilterChange({ ...filters, area: e.target.value })}
      >
        <option value="">Todas</option>
        {masterData.areas.map((area) => (
          <option key={area.id} value={area.id}>{area.name}</option>
        ))}
      </select>

      <label className="block mt-4 text-sm font-medium text-gray-300">Objetivo</label>
      <select
        className="w-full p-2 border rounded-md mt-1 bg-gray-800 text-gray-200 border-gray-700"
        value={filters.objective ?? ""}
        onChange={(e) => onFilterChange({ ...filters, objective: e.target.value })}
      >
        <option value="">Todos</option>
        {masterData.objectives.map((obj) => (
          <option key={obj.id} value={obj.id}>{obj.name}</option>
        ))}
      </select>
    </div>
  );
}
