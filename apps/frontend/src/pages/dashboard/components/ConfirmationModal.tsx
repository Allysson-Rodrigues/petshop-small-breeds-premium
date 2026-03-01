
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
        <div className="p-6 pt-8 text-center">
          <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
            variant === "danger" ? "bg-red-50 text-red-500" : "bg-primary/5 text-primary"
          }`}>
            <span className="material-symbols-outlined text-3xl">
              {variant === "danger" ? "warning" : "info"}
            </span>
          </div>

          <h3 className="text-xl font-bold text-primary mb-2 tracking-tight">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-sm font-medium text-gray-400 hover:bg-gray-50 transition-colors border-r border-gray-100"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              variant === "danger"
                ? "text-red-500 hover:bg-red-50"
                : "text-primary hover:bg-gray-50"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
