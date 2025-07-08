import { FaExclamationTriangle, FaTimesCircle, FaCheckCircle, FaCog, FaChartBar, FaCalendarAlt, FaCubes } from "react-icons/fa";
import { Indicator } from "../types/indicator";

type IndicatorListProps = {
  indicators: Indicator[];
  handleShowChart: (indicator: Indicator) => void;
  handleShowConfig: (indicator: Indicator) => void;
};

export default function IndicatorList({ indicators, handleShowChart, handleShowConfig }: IndicatorListProps) {
  const getStatusIcon = (status: number) => {
    if (status === 0) return <FaCubes className="text-gray-500 mr-2" title="Sin definir" />;
    if (status === 1) return <FaExclamationTriangle className="text-yellow-500 mr-2" />;
    if (status === 2) return <FaTimesCircle className="text-red-500 mr-2" />;
    return <FaCheckCircle className="text-green-500 mr-2" />;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {indicators.map((point) => {
        const min = point.min ?? 0;
        const max = point.max ?? 100;

        const progressValue =
          point.value === null || point.value === undefined
            ? 0
            : point.value < min
            ? 0
            : point.value > max
            ? 100
            : ((point.value - min) / (max - min)) * 100;

        const progressColor =
          point.status.id === 0 ? "bg-gray-500" :
          point.status.id === 1 ? "bg-yellow-500" :
            point.status.id === 2 ? "bg-red-500" :
              "bg-green-500";

        return (
          <div key={point.id} className="relative bg-gray-800 rounded-lg shadow-lg p-5 transition-all hover:scale-105 flex flex-col justify-between h-full">
            <div className="absolute top-2 right-2 text-xs text-gray-400 flex items-center">
              {point.status.id === 0 ? (
              "---"
              ) : (
              <>
                <FaCalendarAlt className="mr-1" />
                {point.date ? new Date(point.date).toLocaleDateString("es-ES") : "N/A"}
              </>
              )}
            </div>
            <div>
              <div className="flex items-center">
                {getStatusIcon(point.status.id)}
                <h3 className="font-semibold truncate max-w-[calc(100%-24px)] text-gray-100">
                  {point.name}
                </h3>
              </div>
              <p className="text-gray-300 text-sm truncate">{point.description}</p>
              <div className="mt-3">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-100">{point.value}</span>
                  <span className="text-gray-500 ml-2">{point.unit}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-1 mt-2">
                  <div className={`${progressColor} h-1 rounded-full`} style={{ width: `${progressValue}%` }}></div>
                </div>
                <p className="text-gray-400 text-xs text-center mt-1">[{min}, {max}]</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="text-gray-300 hover:text-gray-400 hover:bg-gray-600 px-3 py-1 rounded-md flex items-center"
                onClick={() => handleShowChart(point)}
              >
                <FaChartBar className="mr-1" />
              </button>
              <button
                className="text-gray-300 hover:text-gray-400 hover:bg-gray-600 px-3 py-1 rounded-md flex items-center"
                onClick={() => handleShowConfig(point)}
              >
                <FaCog className="mr-1" />
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}
