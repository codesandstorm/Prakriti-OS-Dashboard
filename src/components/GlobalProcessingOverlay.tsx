import React from 'react';
import { useStore } from '../hooks/useStore';

export const GlobalProcessingOverlay: React.FC = () => {
  const { isProcessing, processingMessage } = useStore();

  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-scrim/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-surface flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-200">
        <div className="relative flex items-center justify-center w-16 h-16 mb-6">
          {/* Outer rotating ring */}
          <svg className="absolute inset-0 w-full h-full text-primary/20 animate-spin" viewBox="0 0 100 100" style={{ animationDuration: '3s' }}>
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" stroke="currentColor" />
          </svg>
          {/* Inner fast rotating ring */}
          <svg className="absolute inset-0 w-full h-full text-primary animate-spin" viewBox="0 0 100 100" style={{ animationDuration: '1s' }}>
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" stroke="currentColor" strokeDasharray="70 200" strokeLinecap="round" />
          </svg>
          {/* Center Icon */}
          <span className="material-symbols-outlined text-primary text-[24px]">sync</span>
        </div>
        
        <h3 className="text-title-lg font-bold text-on-surface mb-2 font-headline text-center">Processing Action</h3>
        <p className="text-body-md text-on-surface-variant text-center font-mono-data tracking-wide uppercase text-[11px] animate-pulse">
          {processingMessage}
        </p>
      </div>
    </div>
  );
};
