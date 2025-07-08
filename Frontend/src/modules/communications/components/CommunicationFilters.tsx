import { FaSearch } from "react-icons/fa";
import { Filters } from "../types/filters";
import { MasterData } from "../types/communication";

interface Props {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  isExpanded: boolean;
  masterData: MasterData;
}

export default function CommunicationFilters({ filters, onFilterChange, isExpanded, masterData }: Props) {
  const toggleStatus = (status: number) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];

    onFilterChange({ ...filters, status: newStatuses });
  };

  const toggleResponsible = (responsibleId: string) => {
    const newResponsibles = filters.responsibles.includes(responsibleId)
      ? filters.responsibles.filter(id => id !== responsibleId)
      : [...filters.responsibles, responsibleId];

    onFilterChange({ ...filters, responsibles: newResponsibles });
  };

  return (
    <div className={`p-4 rounded-md w-full transition-all duration-300 ${isExpanded ? "hidden" : "block"}`}>
      <h3 className="font-semibold text-lg text-gray-100">Comunicaciones Externas</h3>

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

      <label className="block mt-4 text-sm font-medium text-gray-300">Tipo de Comunicación</label>
      <select
        className="w-full p-2 border rounded-md mt-1 bg-gray-800 text-gray-200 border-gray-700"
        value={filters.category}
        onChange={(e) => onFilterChange({ ...filters, category: Number(e.target.value) })}
      >
        <option value="">Seleccionar...</option>
        {masterData.categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>

      <label className="block mt-4 text-sm font-medium text-gray-300">Origen</label>
      <select
        className="w-full p-2 border rounded-md mt-1 bg-gray-800 text-gray-200 border-gray-700"
        value={filters.origin}
        onChange={(e) => onFilterChange({ ...filters, origin: Number(e.target.value) })}
      >
        <option value="">Seleccionar...</option>
        {masterData.origins.map((origin) => (
          <option key={origin.id} value={origin.id}>{origin.name}</option>
        ))}
      </select>

      <label className="block mt-4 text-sm font-medium text-gray-300">Formato</label>
      <select
        className="w-full p-2 border rounded-md mt-1 bg-gray-800 text-gray-200 border-gray-700"
        value={filters.format}
        onChange={(e) => onFilterChange({ ...filters, format: Number(e.target.value) })}
      >
        <option value="">Seleccionar...</option>
        {masterData.formats.map((format) => (
          <option key={format.id} value={format.id}>{format.name}</option>
        ))}
      </select>

      <label className="block mt-4 text-sm font-medium text-gray-300">Estado</label>
      {masterData.statuses.map((status) => (
        <div key={status.id} className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={filters.status.includes(status.id!)}
            onChange={() => toggleStatus(status.id!)}
            className="mr-2"
          />
          <span
            className="text-gray-200 cursor-pointer"
            onClick={() => toggleStatus(status.id!)}
          >
            {status.name}
          </span>
        </div>
      ))}

      <label className="block mt-4 text-sm font-medium text-gray-300">Responsables</label>
      {masterData.responsibles.map((responsible) => (
        <div key={responsible.id} className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={filters.responsibles.includes(responsible.id!)}
            onChange={() => toggleResponsible(responsible.id!)}
            className="mr-2"
          />
          <span
            className="text-gray-200 cursor-pointer"
            onClick={() => toggleResponsible(responsible.id!)}
          >
            {responsible.name}
          </span>
        </div>
      ))}
    </div>
  );
}
