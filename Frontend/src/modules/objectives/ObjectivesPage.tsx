import { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  FaCompress,
  FaExpand,
  FaSitemap,
  FaTable,
  FaFileExcel,
  FaFilter
} from "react-icons/fa";

import { Filters } from "./types/fiters";
import { filterData } from "./utils/filterData";

import ObjectivesFilters from "./components/ObjetivesFilter";
import ObjectivesTable from "./components/ObjetivesTable";
import ObjectivesTree from "./components/ObjetivesTree";
import ObjetivesAsExcel from "./components/ObjetivesAsExcel";

import ObjectivesFiltersSkeleton from "./components/skeletons/ObjectivesFiltersSkeleton";
import ObjectiveTableSkeleton from "./components/skeletons/ObjectiveTableSkeleton";

import { useGetAllActionPlans, useGetObjectiveMasterData } from "@/api/generated/action-plans";
import { actionDtoToAction, adaptCommunicationMasterData } from "./types/adapters";

export default function ObjectivesPage() {
  const [viewMode, setViewMode] = useState<"table" | "tree" | "excel">("table");
  const [filters, setFilters] = useState<Filters>({
    year: new Date().getFullYear(),
    searchText: "",
    area: "",
    objective: ""
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const { data: resp, isLoading } = useGetAllActionPlans();
  const allData = (resp?.data ?? []).map(actionDtoToAction);

  const { data: respMaster, isLoading: isMasterLoading } = useGetObjectiveMasterData(); 
  const masterData = adaptCommunicationMasterData(
    respMaster?.data ?? {
      areas: [],
      objectives: [],
      statuses: [],
      years: [],
    }
  );

  const { finalActions } = filterData(masterData.areas, masterData.objectives, allData, filters);

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-5">Objetivos Anuales</h1>



      <div className="flex gap-6 min-h-[80vh]">
        {!isExpanded && (
          <div className="hidden xl:block w-1/5 bg-gray-800 p-4 rounded-md shadow-md h-full">
            {isMasterLoading ? (
              <ObjectivesFiltersSkeleton />
            ) : (
              <ObjectivesFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                masterData={masterData}
              />
            )}
          </div>
        )}

        <div className="flex-1 w-4/5 bg-gray-800 p-4 rounded-md shadow-md h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-200">Año {filters.year}</h2>
            <button
              onClick={() => setDrawerOpen(true)}
              className="block xl:hidden p-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
            >
              <FaFilter />
              
            </button>            
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("table")}
                className="p-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
                title="Vista Tabla"
              >
                <FaTable />
              </button>
              <button
                onClick={() => setViewMode("tree")}
                className="p-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
                title="Vista Árbol"
              >
                <FaSitemap />
              </button>
              <button
                onClick={() => setViewMode("excel")}
                className="p-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
                title="Vista Excel"
              >
                <FaFileExcel />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden xl:inline-flex p-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
                title="Expandir/Contraer panel de filtros"
              >
                {isExpanded ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>

          {viewMode === "table" && (
            isLoading ? (
              <ObjectiveTableSkeleton columns={8} rows={5} />
            ) : (
              <ObjectivesTable actions={finalActions} masterData={masterData} />
            )
          )}
          {viewMode === "tree" && <ObjectivesTree actions={finalActions} masterData={masterData} />}
          {viewMode === "excel" && <ObjetivesAsExcel actions={finalActions} masterData={masterData} />}
        </div>
      </div>

      <Dialog open={drawerOpen} onClose={() => setDrawerOpen(false)} className="relative z-50 xl:hidden">
        <div
          className="fixed inset-0 bg-black/30"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-gray-900 p-4 overflow-y-auto shadow-xl">
          <button
            className="mb-4 text-white ml-auto flex justify-end"
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar filtros"
          >
            <span className="sr-only">Cerrar filtros</span>
            <FaCompress className="text-lg rotate-45" />
          </button>
          <ObjectivesFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            masterData={masterData}
          />
        </div>
      </Dialog>
    </>
  );
}
