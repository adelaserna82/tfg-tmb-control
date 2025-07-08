import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type DialogBoxProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  iconColor?: string;
  confirmColor?: string;
};

export default function DialogBox({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  iconColor = "text-red-600",
  confirmColor = "bg-red-600 hover:bg-red-500",
}: DialogBoxProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-center sm:p-0">
        <DialogPanel
          transition
          className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
        >
          <div className="bg-white dark:bg-gray-800 px-6 py-5 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-700 sm:mx-0 sm:size-10">
                <ExclamationTriangleIcon aria-hidden="true" className={`size-6 ${iconColor}`} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle as="h3" className="text-lg font-semibold text-white">
                  {title}
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-300">{message}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onConfirm}
              className={`inline-flex w-full justify-center rounded-md ${confirmColor} px-4 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 ring-1 shadow-sm ring-gray-300 ring-inset hover:bg-gray-600 sm:mt-0 sm:w-auto"
            >
              {cancelText}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
