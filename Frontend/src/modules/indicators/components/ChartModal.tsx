import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, Tooltip } from "recharts";
import { Indicator } from "../types/indicator";

type ChartModalProps = {
  show: boolean;
  handleClose: () => void;
  indicator: Indicator | null;
};

export default function ChartModal({ show, handleClose, indicator }: ChartModalProps) {

  const generateHistoricalData = () => {
    if (!indicator?.history) return [];
    return indicator.history.map((item, _) => ({
      date: new Date(item.timestamp).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }),
      value: item.value,
    }));
  };

  return (
    <Dialog open={show} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-center sm:p-0">
        <DialogPanel
          transition
          className="relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-gray-800 text-white shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
        >
          <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
            <DialogTitle as="h3" className="text-lg font-semibold">{indicator?.name ?? "Histórico de datos"}</DialogTitle>
            <button onClick={handleClose} className="text-gray-300 hover:text-white transition">
              ✕
            </button>
          </div>
          <div className="px-6 py-4">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={generateHistoricalData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
