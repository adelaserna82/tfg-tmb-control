import { Dialog, DialogPanel, DialogBackdrop, DialogTitle } from "@headlessui/react";
import { Communication } from "../types/communication";

interface CommunicationHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  history: Communication[] | null;
}

export default function CommunicationHistoryDialog({
  open,
  onClose,
  history,
}: CommunicationHistoryDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-center sm:p-0">
        <DialogPanel
          className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-gray-800 text-white shadow-xl transition-all sm:my-8 max-h-[90vh] flex flex-col"
        >
          {/* Cabecera */}
          <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
            <DialogTitle as="h3" className="text-lg font-semibold">Historial de Comunicación</DialogTitle>
            <button onClick={onClose} className="text-gray-300 hover:text-white transition">✕</button>
          </div>
          {/* Cuerpo */}
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 pr-2">
            {history && history.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700 text-gray-300 text-sm uppercase tracking-wider border-b border-gray-600">
                    <th className="p-3 text-left">Tipo</th>
                    <th className="p-3 text-left">Origen</th>
                    <th className="p-3 text-left">Formato</th>
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-left">Descripción</th>
                    <th className="p-3 text-left">Fichero</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((comm) => (
                    <tr key={comm.id} className="border-b border-gray-600">
                      <td className="py-3 px-3 text-gray-200">{comm.category.name}</td>
                      <td className="py-3 px-3 text-gray-200">{comm.origin.name}</td>
                      <td className="py-3 px-3 text-gray-200">{comm.format?.name ?? "-"}</td>
                      <td className="py-3 px-3 text-gray-300">
                        {new Date(comm.date).toLocaleDateString("es-ES")}
                      </td>
                      <td className="py-3 px-3 text-gray-300">{comm.description}</td>
                      <td className="py-3 px-3 text-gray-300">
                        <button
                          className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition"
                          title="Copiar ruta del archivo"
                          onClick={() => {
                            if (comm.filePath) {
                              navigator.clipboard.writeText(comm.filePath);
                            } else {
                              alert("No hay fichero disponible para copiar.");
                            }
                          }}
                        >
                          📋
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400">No hay historial disponible.</p>
            )}
          </div>

          <div className="bg-gray-900 px-6 py-4 flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600">
              Cerrar
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}