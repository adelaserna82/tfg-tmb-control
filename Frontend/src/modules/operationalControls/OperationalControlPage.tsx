import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaExpand, FaCompress, FaFilter } from "react-icons/fa";
import { sortByDateAscending } from "./utils/dateUtils";
import { Filters } from "./types/filters";
import OperationalControlFilters from "./components/OperationalControlFilters";
import OperationalControlTable from "./components/OperationalControlTable";
import { filterOperationalControlForTable } from "./utils/filterOperationalControlForTable";
import {
  useGetAllActualControls,
  useGetOperationalControlMasterData,
} from "@/api/generated/operational-control";
import {
  adaptOperationalControlMasterData,
  dtoToActualControl,
} from "./types/adapters";
import OperationalControlFiltersSkeleton from "./components/skeletons/OperationalControlFiltersSkeleton";
import OperationalControlTableSkeleton from "./components/skeletons/OperationalControlTableSkeleton";

export default function OperationalControlPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [resetPageCounter, setResetPageCounter] = useState(0);

  const [filters, setFilters] = useState<Filters>({
    group: 0,
    frequency: 0,
    status: [],
    year: new Date().getFullYear(),
    searchText: "",
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setResetPageCounter((prev) => prev + 1);
  };

  const { data: masterResp, isLoading: masterIsLoading } = useGetOperationalControlMasterData();
  const masterData = adaptOperationalControlMasterData(masterResp?.data ?? {
    groups: [],
    frequencies: [],
    statuses: [],
    years: [],
  });

  const { data: resp, isLoading } = useGetAllActualControls();
  const filteredData = sortByDateAscending(
    filterOperationalControlForTable((resp?.data ?? []).map(dtoToActualControl), filters)
  );

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-5">Control Operacional</h1>



      <div className="flex gap-6 min-h-[80vh]">
        {!isExpanded && (
          <div className="hidden xl:block w-1/5 bg-gray-800 p-4 rounded-md shadow-md h-full">
            {masterIsLoading ? (
              <OperationalControlFiltersSkeleton filtersCount={4} />
            ) : (
              <OperationalControlFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                isExpanded={isExpanded}
                masterData={masterData}
              />
            )}
          </div>
        )}

        <div className="flex-1 w-4/5 bg-gray-800 p-4 rounded-md shadow-md h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-200">&nbsp;</h2>
              <button
                onClick={() => setDrawerOpen(true)}
                className="block xl:hidden p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition"
              >
                <FaFilter />
              </button>              
            <div className="flex space-x-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden xl:inline-flex p-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
              >
                {isExpanded ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>

          {isLoading ? (
            <OperationalControlTableSkeleton columns={7} rows={10} />
          ) : (
            <OperationalControlTable
              actualControls={filteredData}
              masterData={masterData}
              resetPageTrigger={resetPageCounter}
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
          <OperationalControlFilters
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
