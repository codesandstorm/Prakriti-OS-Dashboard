import React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'w-[400px]',
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-over Panel */}
      <div 
        className={`fixed right-0 top-0 h-full ${width} bg-white shadow-2xl z-50 border-l border-outline-variant flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-gutter border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">{title}</h2>
          <button 
            className="p-2 hover:bg-surface-container-high rounded-full transition-all flex items-center justify-center" 
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};
export default Drawer;
