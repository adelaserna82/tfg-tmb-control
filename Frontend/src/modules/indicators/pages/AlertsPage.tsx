import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import { Indicator } from "../types/indicator";
import IndicatorItem from "../components/IndicatorItem";
import { useGetAllIndicators } from "@/api/generated/indicators";
import { dtoToIndicator } from "../types/adapters";
import IndicatorAlertErrorSkeleton from "../components/skeletons/IndicatorAlertErrorSkeleton";

export default function AlertsPage() {


  const { data: resp, isLoading } = useGetAllIndicators();

  const indicators: Indicator[] = resp?.data.map(dtoToIndicator) ?? [];
    const alertIndicators: Indicator[] = indicators.filter((indicator) => indicator.status.id === 1)?? [];
    const errorIndicators: Indicator[] = indicators.filter((indicator) => indicator.status.id === 2)?? [];
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Indicadores en Alerta y Error</h1>
        <Link to="/indicadores" className="flex items-center text-gray-900 hover:text-gray-300 hover:bg-gray-500 p-2 rounded-md transition">
          <FaArrowLeft className="mr-2" /> Volver al Dashboard
        </Link>
      </div>
       {isLoading ? (
        <IndicatorAlertErrorSkeleton />
      ) : (
        <>
         {alertIndicators.length > 0 && (
            <div className="mb-6">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                <h2 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                  Indicadores en Alerta ({alertIndicators.length})
                </h2>
              </div>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {alertIndicators.map((indicator) => (
                  <IndicatorItem key={indicator.id} indicator={indicator} color="yellow" />
                ))}
              </div>
            </div>
          )}
          {errorIndicators.length > 0 && (
            <div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 ">
                  Indicadores en Error ({errorIndicators.length})
                </h2>
              </div>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {errorIndicators.map((indicator) => (
                  <IndicatorItem key={indicator.id} indicator={indicator} color="red" />
                ))}
              </div>
            </div>
          )}
          {alertIndicators.length === 0 && errorIndicators.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              No hay indicadores en alerta o error en este momento.
            </p>
          )}
        </>
      )}
    </>
  );
}
