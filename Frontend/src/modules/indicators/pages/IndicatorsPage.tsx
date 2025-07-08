import { useEffect, useState } from "react";
import { FaChartBar, FaCubes, FaMapMarkedAlt, FaPlus } from "react-icons/fa";
import { Indicator } from "../types/indicator";
import AlertsBar from "../components/AlertsBar";
import { FilterButtons } from "../components/FilterButtons";
import SearchBar from "../components/SearchBar";
import IndicatorListGraphs from "../components/IndicatorListGraphs";
import PlantMap from "../components/PlantMap";
import IndicatorList from "../components/IndicatorList";
import ConfigurationModal from "../components/ConfigurationModal";
import ChartModal from "../components/ChartModal";
import { queryClient } from '@/lib/queryClient';

import {
  useGetAllIndicators,
  useGetIndicatorMasterData,
  useGetIndicatorsByCategoryWithHistory,


} from '@/api/generated/indicators';

import { adaptIndicatorsMasterData, dtoToIndicator } from "../types/adapters";
import IndicatorGraphsSkeleton from "../components/skeletons/IndicatorGraphsSkeleton";
import PlantMapSkeleton from "../components/skeletons/PlantMapSkeleton";
import IndicatorListSkeleton from "../components/skeletons/IndicatorListSkeleton";
import { getGetIndicatorsByCategoryWithHistoryQueryKey } from '@/api/generated/indicators';
import { useIndicatorsChanged } from "../hooks/useIndicatorsChanged";
import { useAuthStore } from "@/store/useAuthStore";
import { Actions, Modules } from "@/constants/permissions";



export default function IndicatorsPage() {
  const [showConfig, setShowConfig] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showView, setShowView] = useState<"list" | "graph" | "map">("list");
  const [selectedPoint, setSelectedPoint] = useState<Indicator | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<number>(1);
  const { indicatorsAreChanged, resetIndicatorsChanged } = useIndicatorsChanged();

  const { hasPermission } = useAuthStore();
  const canCreate = hasPermission(Modules.Indicators, Actions.Create)

  const handleCloseChart = () => setShowChart(false);

  const handleShowConfig = (indicator: Indicator) => {
    setSelectedPoint(indicator);
    setShowConfig(true);
  };

  const handleShowChart = (indicator: Indicator) => {
    setSelectedPoint(indicator);
    setShowChart(true);
  };

  const handleAddIndicator = () => {
    const newIndicator: Indicator = {
      id: "",
      code: "",
      name: "",
      description: "",
      value: null,
      date: null,
      category: {
        id: 0,
        name: "",
        description: "",
        order: 0,
      },
      frequency: { id: 0, name: "" },
      status: { id: 0, name: "Normal" },
      min: 0,
      max: 100,
      unit: "",
      xLocation: 50,
      yLocation: 50,
      isErrorConfigured: false,
      minError: 0,
      maxError: 0,
      isAlertConfigured: false,
      minAlert: 0,
      maxAlert: 0,
      history: [],
    };

    setSelectedPoint(newIndicator);
    setShowConfig(true);
  };


  const { data: resp, isLoading } = useGetIndicatorsByCategoryWithHistory(categoryFilter);
  const { data: allIndicatorsResp } = useGetAllIndicators();
  const { data: masterResp } = useGetIndicatorMasterData();

  useEffect(() => {
    if (indicatorsAreChanged) {
      queryClient.invalidateQueries({
        queryKey: getGetIndicatorsByCategoryWithHistoryQueryKey(categoryFilter),
      });
      resetIndicatorsChanged();
    }
  }, [indicatorsAreChanged]);




  const filteredIndicators: Indicator[] =
    (resp?.data ?? []).map(dtoToIndicator);

  const allIndicators: Indicator[] =
    (allIndicatorsResp?.data ?? []).map(dtoToIndicator);


  const masterData = adaptIndicatorsMasterData(
    masterResp?.data ??
    {
      frequencies: [],
      categories: [],
    }
  );

  return (
    <>
      <h1 className="relative text-3xl font-bold text-gray-800 mb-5">Indicadores</h1>
      <AlertsBar indicators={filteredIndicators} />
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:justify-between md:items-center">
        <FilterButtons categories={masterData.categories} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
        <div className="flex items-center space-x-4">
          <SearchBar indicators={allIndicators} categories={masterData.categories} setCategoryFilter={setCategoryFilter} />
          {canCreate && (
            <button
              onClick={handleAddIndicator}
              className="flex items-center bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-md transition"
            >
              <FaPlus />
            </button>
          )}
          <button
            onClick={() => setShowView("list")}
            className={`p-2 rounded-md transition ${showView === "list" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            <FaCubes size={18} />
          </button>

          <button
            onClick={() => setShowView("graph")}
            className={`p-2 rounded-md transition ${showView === "graph" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            <FaChartBar size={18} />
          </button>

          <button
            onClick={() => setShowView("map")}
            className={`p-2 rounded-md transition ${showView === "map" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            <FaMapMarkedAlt size={18} />
          </button>
        </div>
      </div>
      <div className="w-full mt-8">
        {isLoading ? (
          showView === 'graph' ? (
            <IndicatorGraphsSkeleton />
          ) : showView === 'map' ? (
            <PlantMapSkeleton />
          ) : (
            <IndicatorListSkeleton />
          )
        ) : showView === 'graph' ? (
          <IndicatorListGraphs indicators={filteredIndicators} />
        ) : showView === 'map' ? (
          <PlantMap
            indicators={filteredIndicators}

          />
        ) : (
          <IndicatorList
            indicators={filteredIndicators}
            handleShowChart={handleShowChart}
            handleShowConfig={handleShowConfig}
          />
        )}
      </div>

      {selectedPoint && (
        <>
          <ConfigurationModal
            showConfig={showConfig}
            setShowConfig={setShowConfig}
            indicator={selectedPoint}
            categoryFilter={categoryFilter}
            masterData={masterData}
          />
          <ChartModal show={showChart} handleClose={handleCloseChart} indicator={selectedPoint} />

        </>

      )}


    </>
  );
}
