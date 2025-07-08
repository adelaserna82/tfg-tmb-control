import { useState } from "react";
import { Link } from "react-router-dom";
import { Notification } from "./types/notification";

import { FaArrowLeft } from "react-icons/fa";
import { useGetUserNotifications } from "@/api/generated/notifications";
import { dtoToNotification } from "./types/adapters";

export default function AllNotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 20;
  const { data: resp } = useGetUserNotifications({ unreadOnly: false });
  const alerts: Notification[] = (resp?.data ?? []).map(dtoToNotification);

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);
  const startIndex = (currentPage - 1) * alertsPerPage;
  const paginatedAlerts = searchQuery ? filteredAlerts : filteredAlerts.slice(startIndex, startIndex + alertsPerPage);


  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold text-gray-800">Todas las Alertas</h1>
        <Link to="/notificaciones" className="flex items-center text-gray-900 hover:text-gray-300 hover:bg-gray-500 p-2 rounded-md transition">
          <FaArrowLeft className="mr-2" /> Volver
        </Link>
      </div>
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-4 relative">
        <input
          type="text"
          placeholder="Buscar alertas..."
          className="w-full p-2 mb-4 text-sm border rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {paginatedAlerts.length === 0 ? (
            <p className="text-gray-400 text-center col-span-3">No se encontraron alertas.</p>
          ) : (
            paginatedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-md bg-gray-800 border-l-4 shadow-sm ${alert.type === "Error" ? "border-red-500" :
                    alert.type === "Warning" ? "border-yellow-500" :
                      "border-blue-500"
                  }`}
              >
                <h3 className="font-semibold text-gray-200">{alert.title}</h3>
                <p className="text-sm text-gray-400">{alert.message}</p>
                <span className="block text-gray-500 text-xs mt-1">{alert.date}</span>
              </div>
            ))
          )}
        </div>
        {!searchQuery && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              ←
            </button>
            <span className="text-sm">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
