import { ToastType } from "../types";

interface ToastProps {
  message: string;
  type: ToastType;
  show: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, show, onClose }: ToastProps) {
  if (!show) return null;

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type];

  const icon = {
    success: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    ),
    error: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    ),
    info: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]`}>
        <div className="flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon}
          </svg>
        </div>
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 p-1 rounded transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
