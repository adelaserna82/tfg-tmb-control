import { useState } from "react";
import { Notification } from "./types/notification";
import { useNavigate } from "react-router-dom";
import {
  getGetUserNotificationsQueryKey,
  useGetUserNotifications,
  useMarkNotificationAsRead,
} from "@/api/generated/notifications";
import { dtoToNotification } from "./types/adapters";
import NotificationsSkeleton from "./components/skeletons/NotificationsSkeleton";
import { queryClient } from "@/lib/queryClient";
import { Dialog } from "@headlessui/react";
import { FaBell, FaCompress } from "react-icons/fa";

export default function NotificationsPage() {
  const [selectedAlert, setSelectedAlert] = useState<Notification | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const markAsRead = (notificationId: string) => {
    updateMutation.mutate({ id: notificationId });
  };

  const { data: resp, isLoading } = useGetUserNotifications({ unreadOnly: true });

  const notifications = (resp?.data ?? []).map(dtoToNotification);

  const updateMutation = useMarkNotificationAsRead({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetUserNotificationsQueryKey({ unreadOnly: true }),
        });
        setSelectedAlert(null);
        setDrawerOpen(false);
      },
    },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold text-gray-800">Avisos y Alertas</h1>
        <button
          onClick={() => navigate("/notificaciones/todas")}
          className="hidden md:inline-block bg-gray-700 text-white text-sm py-2 px-4 rounded-md hover:bg-gray-600"
        >
          Ver todas las alertas
        </button>
      </div>

      <button
        onClick={() => navigate("/notificaciones/todas")}
        className="md:hidden fixed bottom-8 right-8 z-20 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
        aria-label="Ver todas las alertas"
      >
        <FaBell className="text-2xl" />
      </button>

      <div className="flex p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        <div className="flex-1 pr-6 border-r border-gray-700 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <h2 className="text-lg font-semibold mb-3">Últimos avisos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {isLoading ? (
              <NotificationsSkeleton />
            ) : notifications.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">No hay alertas sin leer.</p>
            ) : (
              notifications.map((not) => (
                <div
                  key={not.id}
                  className="p-3 rounded-md bg-gray-800 border-l-4 cursor-pointer transition hover:bg-gray-700"
                  onClick={() => {
                    setSelectedAlert(not);
                    setDrawerOpen(true);
                  }}
                  style={{
                    borderColor:
                      not.type === "Error"
                        ? "#DC2626"
                        : not.type === "Warning"
                        ? "#FBBF24"
                        : "#3B82F6",
                  }}
                >
                  <h3 className="font-semibold text-gray-200">{not.title}</h3>
                  <p className="text-sm text-gray-400">{not.message}</p>
                  <span className="block text-gray-500 text-xs mt-1">
                    {new Date(not.date).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      <Dialog
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedAlert(null);
        }}
        className="relative z-50 "
      >
        <div
          className="fixed inset-0 bg-black/30 md:hidden text-gray-300"
          aria-hidden="true"
          onClick={() => {
            setDrawerOpen(false);
            setSelectedAlert(null);
          }}
        />
        <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-gray-900 p-4 overflow-y-auto shadow-xl text-gray-300">
          <button
            className="mb-4 text-white ml-auto flex justify-end"
            onClick={() => {
              setDrawerOpen(false);
              setSelectedAlert(null);
            }}
            aria-label="Cerrar detalle"
          >
            <span className="sr-only">Cerrar detalle</span>
            <FaCompress className="text-lg rotate-45" />
          </button>
          {selectedAlert && (
            <>
              <h3 className="text-lg font-semibold mb-2">{selectedAlert.title}</h3>
              <p className="mb-2">{selectedAlert.message}</p>
                <span className="block text-xs mb-4">
                {new Date(selectedAlert.date).toLocaleDateString("es-ES")}
                </span>
              {!selectedAlert.viewed && (
                <button
                  onClick={() => markAsRead(selectedAlert.id)}
                  className="w-full bg-green-500 text-white text-sm py-2 rounded-md hover:bg-green-600 mb-2"
                >
                  Marcar como leído
                </button>
              )}
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setSelectedAlert(null);
                }}
                className="w-full bg-gray-500 text-white text-sm py-2 rounded-md hover:bg-gray-600"
              >
                Cerrar
              </button>
            </>
          )}
        </div>
      </Dialog>
    </>
  );
}
