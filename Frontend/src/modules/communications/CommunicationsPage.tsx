import { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  FaExpand,
  FaCompress,
  FaTable,
  FaSitemap,
  FaInfo,
  FaFilter,
} from "react-icons/fa";
import CommunicationFilters from "./components/CommunicationFilters";
import CommunicationTable from "./components/CommunicationTable";
import CommunicationTree from "./components/CommunicationTree";
import CommunicationFiltersSkeleton from "./components/skeletons/CommunicationFiltersSkeleton";
import CommunicationTableSkeleton from "./components/skeletons/CommunicationTableSkeleton";
import {
  useGetAllCommunications,
  useGetCommunicationMasterData,
} from "@/api/generated/communications";
import { sortByDateAscending } from "./utils/dateUtils";
import { filterTreeByParentMatch } from "./utils/filterTreeByParentMatch";
import { filterCommunicationsForTable } from "./utils/filterCommunicationsForTable";
import { adaptCommunicationMasterData, dtoToCommunication } from "./types/adapters";
import { Filters } from "./types/filters";

export default function CommunicationsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "tree">("table");

  const [filters, setFilters] = useState<Filters>({
    category: 0,
    status: [],
    year: new Date().getFullYear(),
    searchText: "",
    origin: 0,
    responsibles: [],
    format: 0,
  });

  const [resetPageCounter, setResetPageCounter] = useState(0);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setResetPageCounter((prev) => prev + 1);
  };

  const { data: masterResp, isLoading: masterIsLoading } = useGetCommunicationMasterData();
  const { data: resp, isLoading } = useGetAllCommunications();

  const masterData = adaptCommunicationMasterData(masterResp?.data ?? {
    categories: [],
    origins: [],
    formats: [],
    responsibles: [],
    statuses: [],
    years: [],
  });

  const allData = sortByDateAscending((resp?.data ?? []).map(dtoToCommunication));
  const filteredDataForTable = sortByDateAscending(filterCommunicationsForTable(allData, filters));
  const filteredDataForTree = sortByDateAscending(filterTreeByParentMatch(allData, filters));

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-5">Comunicaciones externas</h1>



      <div className="flex gap-6 min-h-[80vh]">
        {!isExpanded && (
          <div className="hidden md:block w-1/5 bg-gray-800 rounded-md shadow-md h-full">
            {masterIsLoading ? (
              <CommunicationFiltersSkeleton filtersCount={4} />
            ) : (
              <CommunicationFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                isExpanded={isExpanded}
                masterData={masterData}
              />
            )}
          </div>
        )}

        <div className="flex-1 w-4/5 bg-gray-800 p-4 rounded-md shadow-md h-full">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold text-gray-200">
              {filters.year === 0 ? "Todos los años" : `Año ${filters.year}`}
            </h2>

            {viewMode === "tree" && (
              <small className="flex items-center gap-2 font-semibold text-gray-200">
                <FaInfo />
                La búsqueda sólo se aplica al padre
              </small>
            )}

            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
            >
              <FaFilter />
              
            </button>

            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode(viewMode === "table" ? "tree" : "table")}
                className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
              >
                {viewMode === "table" ? <FaSitemap /> : <FaTable />}
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden md:block p-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
              >
                {isExpanded ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>

          {viewMode === "table" ? (
            isLoading ? (
              <CommunicationTableSkeleton columns={7} rows={10} />
            ) : (
              <CommunicationTable
                communications={filteredDataForTable}
                communicationsWithOutFilters={allData}
                masterData={masterData}
                resetPageTrigger={resetPageCounter}
              />
            )
          ) : (
            <CommunicationTree
              communications={filteredDataForTree}
              communicationsWithOutFilters={allData}
              masterData={masterData}
            />
          )}
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
          <CommunicationFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            isExpanded={false}
            masterData={masterData}
          />
        </div>
      </Dialog>
    </>
  );
}
