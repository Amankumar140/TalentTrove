import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-5 py-3.5 rounded-xl text-sm font-medium shadow-2xl backdrop-blur-xl border animate-slide-in-right flex items-start gap-3 ${
              toast.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-300"
                : toast.type === "error"
                ? "bg-red-500/15 border-red-500/20 text-red-300"
                : toast.type === "warning"
                ? "bg-amber-500/15 border-amber-500/20 text-amber-300"
                : "bg-blue-500/15 border-blue-500/20 text-blue-300"
            }`}
          >
            <span className="text-base mt-0.5 flex-shrink-0">
              {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : toast.type === "warning" ? "⚠️" : "ℹ️"}
            </span>
            <span className="leading-snug">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-auto text-white/40 hover:text-white/80 transition-colors text-lg leading-none flex-shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
