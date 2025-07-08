import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, Tooltip } from "recharts";
import { Indicator } from "../types/indicator";


type IndicatorListGraphsProps = {
  indicators: Indicator[];
};

export default function IndicatorListGraphs({ indicators }: IndicatorListGraphsProps) {
  const generateHistoricalData = (indicator:Indicator) => {
    if (!indicator?.history) return [];
    return indicator.history.map((item, _) => ({
      date: new Date(item.timestamp).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }),
      value: item.value,
    }));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {indicators.map((indicator) => (
        <div key={indicator.id} className="bg-gray-800 rounded-lg shadow-lg p-5 transition-all hover:scale-105">
          <h3 className="font-semibold text-gray-100 truncate">{indicator.name}</h3>
          <div className="w-full h-32 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateHistoricalData(indicator)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
