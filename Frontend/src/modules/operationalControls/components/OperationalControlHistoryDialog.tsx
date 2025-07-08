
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Revision } from "../types/operationalControl";

interface Props {
  open: boolean;
  onClose: () => void;
  history: Revision[] | null;
}

export default function OperationalControlHistoryDialog({ open, onClose, history }: Props) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-gray-800 text-white shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
            <DialogTitle as="h3" className="text-lg font-semibold">
              Historial
            </DialogTitle>
            <button onClick={onClose} className="text-gray-300 hover:text-white transition">
              ✕
            </button>
          </div>
          <div className="px-6 py-4 space-y-4">
            {history && history.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700 text-gray-300 text-sm uppercase tracking-wider border-b border-gray-600">
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-left">Próxima Rev.</th>
                    <th className="p-3 text-left">Frecuencia</th>
                    <th className="p-3 text-left">Situación</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((rev, idx) => (
                    <tr key={idx} className="border-b border-gray-600">
                      <td className="py-3 px-3 text-gray-200">
                        {rev.date ? new Date(rev.date).toLocaleDateString("es-ES") : "-"}
                      </td>
                      <td className="py-3 px-3 text-gray-300">
                        {rev.nextReview ? new Date(rev.nextReview).toLocaleDateString("es-ES") : "-"}
                      </td>
                      <td className="py-3 px-3 text-gray-300">{rev.frequency?.name}</td>
                      <td className="py-3 px-3 text-gray-300">{rev.status.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400">No hay historial disponible.</p>
            )}
          </div>
          <div className="bg-gray-900 px-6 py-4 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
