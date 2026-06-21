import React, { useEffect, useState } from 'react';
import { useStore } from '../hooks/useStore';

export const ToastContainer: React.FC = () => {
  const { isOnline } = useStore();
  const [showStatusToast, setShowStatusToast] = useState(false);

  useEffect(() => {
    setShowStatusToast(true);
    const timer = setTimeout(() => setShowStatusToast(false), 3000);
    return () => clearTimeout(timer);
  }, [isOnline]);

  if (!showStatusToast) return null;

  return (
    <div className="fixed bottom-12 right-4 z-[90] flex flex-col gap-2 select-none pointer-events-none">
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
    </div>
  );
};
export default ToastContainer;
