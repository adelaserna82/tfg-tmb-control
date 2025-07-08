
import { Indicator } from "../types/indicator";

type IndicatorItemProps = {
  indicator: Indicator;
  color: "yellow" | "red"; 
};

export default function IndicatorItem({ indicator, color}: IndicatorItemProps) {
  const min = indicator.min ?? 0;
  const max = indicator.max ?? 100;
  const progressValue =
    indicator.value === undefined || indicator.value === null
      ? 0
      : indicator.value < min
      ? 0
      : indicator.value > max
      ? 100
      : ((indicator.value - min) / (max - min)) * 100;


  return (
    <div className="p-4 rounded-lg shadow bg-gray-100 dark:bg-gray-800">
      <div className="flex justify-between items-center">
        <span className="text-gray-900 dark:text-gray-100 font-medium">{indicator.name}</span>
        <span className={`px-2 py-1 text-xs font-semibold rounded-md bg-${color}-600 text-white`}>
          {indicator.value} {indicator.unit}
        </span>
      </div>
      <div className="w-full bg-gray-300 dark:bg-gray-700 h-1.5 rounded-full mt-2">
        <div className={`h-full rounded-full bg-${color}-500`} style={{ width: `${progressValue}%` }}></div>
      </div>
      <div className="flex justify-between text-gray-500 dark:text-gray-400 text-xs mt-2">
        <small>Mín: {min} {indicator.unit}</small>
       <small>Máx: {max} {indicator.unit}</small>
      </div>
    </div>
  );
}
