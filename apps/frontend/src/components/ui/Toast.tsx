interface ToastProps {
    message: string;
}

export default function Toast({ message }: ToastProps) {
    if (!message) return null;

    return (
        <div role="status" aria-live="polite" className="fixed bottom-4 right-4 bg-[#1f1f1f] text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-[fadeInUp_0.3s_ease-out]">
            <span className="material-symbols-outlined text-[20px] text-green-400">
                check_circle
            </span>
            <span className="font-medium text-sm">{message}</span>
        </div>
    );
}
