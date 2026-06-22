import React, { useEffect, useState } from 'react';
import { useStore } from '../hooks/useStore';

export const ToastContainer: React.FC = () => {
  const { isOnline, globalToasts } = useStore();
  const [showStatusToast, setShowStatusToast] = useState(false);

  useEffect(() => {
    setShowStatusToast(true);
    const timer = setTimeout(() => setShowStatusToast(false), 3000);
    return () => clearTimeout(timer);
  }, [isOnline]);

  return (
    <div className="fixed bottom-12 right-4 z-[90] flex flex-col gap-2 select-none pointer-events-none">
      {/* Existing Connection Toast */}
      {showStatusToast && (
        <div className={`px-4 py-2 text-white font-label-md text-xs font-bold rounded shadow-lg flex items-center gap-2 transition-all ${
          isOnline ? 'bg-primary' : 'bg-error'
        }`}>
          <span className="material-symbols-outlined text-[16px]">
            {isOnline ? 'wifi' : 'wifi_off'}
          </span>
          <span>
            {isOnline ? 'SYSTEM CONNECTIVITY ESTABLISHED' : 'COMMAND CONNECTION OFFLINE'}
          </span>
        </div>
      )}

      {/* Global Business Logic Toasts */}
      {globalToasts.map((toast) => (
        <div key={toast.id} className={`px-4 py-3 text-white font-label-md text-xs font-bold rounded shadow-lg flex items-center gap-2 transition-all pointer-events-auto ${
          toast.type === 'success' ? 'bg-green-600' :
          toast.type === 'error' ? 'bg-error' :
          'bg-primary-container text-on-primary-fixed-variant border border-primary/20'
        }`}>
          <span className="material-symbols-outlined text-[16px]">
            {toast.type === 'success' ? 'check_circle' :
             toast.type === 'error' ? 'error' : 'info'}
          </span>
          <span className="max-w-xs">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
export default ToastContainer;
