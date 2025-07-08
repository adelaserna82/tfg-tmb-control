import { XMarkIcon } from "@heroicons/react/24/outline";
import { Alert } from "./types/alerts";

interface AlertsPanelProps {
    alerts: Alert[];
    onClose: () => void;
}

export default function AlertsPanel({ alerts, onClose }: AlertsPanelProps) {
    return (
        <>
            <div
                className="fixed inset-0  bg-opacity-50 transition-opacity duration-300 opacity-100"
                onClick={onClose}
            ></div>
            <div className="fixed top-0 right-0 w-80 h-full bg-gray-900 shadow-lg transform transition-transform translate-x-0 duration-700 p-4 flex flex-col z-50">

                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <h2 className="text-lg font-bold text-white">Avisos</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="mt-4 space-y-3 overflow-y-auto flex-grow">
                    {alerts.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center">No hay avisos nuevos.</p>
                    ) : (
                        alerts.map((alert) => (
                            <div key={alert.id} className={`p-3 rounded-lg ${alert.type === "error" ? "bg-red-500" : alert.type === "warning" ? "bg-yellow-500" : "bg-blue-500"}`}>
                                <h3 className="text-white font-semibold">{alert.title}</h3>
                                <p className="text-white text-sm">{alert.message}</p>
                                <span className="block text-gray-200 text-xs mt-1">{alert.date}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>

    );
}
