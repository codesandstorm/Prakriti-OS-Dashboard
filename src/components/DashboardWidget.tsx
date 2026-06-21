import React, { useState } from 'react';

interface DashboardWidgetProps {
  title: string;
  onRefresh?: () => Promise<void> | void;
  onExport?: () => void;
  onDrillDown?: () => void;
  isEmpty?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  onRefresh,
  onExport,
  onDrillDown,
  isEmpty = false,
  isError = false,
  isLoading = false,
  children
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setLocalLoading(true);
      await onRefresh();
      setLocalLoading(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      alert(`Exporting telemetry metrics for widget "${title}" as CSV...`);
    }
  };

  const activeLoading = isLoading || localLoading;

  const content = (
    <div className={`flex flex-col bg-white border border-outline-variant rounded-lg overflow-hidden h-full ${
      isFullscreen ? 'fixed inset-4 z-[100] shadow-2xl' : 'hover:shadow-md hover:border-primary transition-all'
    }`}>
      {/* Header controls */}
      <div className="px-4 py-2 border-b border-outline-variant bg-surface-container-low flex justify-between items-center select-none">
        <h3 className="font-label-md text-label-md font-bold text-primary uppercase tracking-wider">
          {title}
        </h3>
        <div className="flex items-center gap-1">
          {onDrillDown && (
            <button 
              onClick={onDrillDown}
              className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant transition-colors flex items-center justify-center"
              title="Drill-down details"
            >
              <span className="material-symbols-outlined text-[16px]">drill</span>
            </button>
          )}
          {onRefresh && (
            <button 
              onClick={handleRefresh}
              className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant transition-colors flex items-center justify-center"
              title="Refresh widget"
            >
              <span className={`material-symbols-outlined text-[16px] ${activeLoading ? 'animate-spin' : ''}`}>
                refresh
              </span>
            </button>
          )}
          <button 
            onClick={handleExport}
            className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant transition-colors flex items-center justify-center"
            title="Export CSV"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant transition-colors flex items-center justify-center"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>
        </div>
      </div>

      {/* Main content body */}
      <div className="flex-1 p-4 relative overflow-auto min-h-[140px] bg-white">
        {activeLoading ? (
          <div className="absolute inset-0 bg-white/70 flex flex-col justify-center items-center gap-2 z-10">
            <span className="material-symbols-outlined animate-spin text-[32px] text-primary">loading_timer</span>
            <span className="text-xs text-on-surface-variant font-mono-data">SYNCING METRICS...</span>
          </div>
        ) : null}

        {isError ? (
          <div className="absolute inset-0 bg-error-container/10 flex flex-col justify-center items-center gap-2 p-4 text-center">
            <span className="material-symbols-outlined text-error text-[36px]">warning</span>
            <span className="text-body-sm font-bold text-error">TELEMETRY TIMEOUT</span>
            <button 
              onClick={handleRefresh} 
              className="mt-1 px-3 py-1 bg-error text-on-error rounded text-xs font-bold uppercase hover:opacity-90"
            >
              Retry Connection
            </button>
          </div>
        ) : isEmpty ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-1 text-on-surface-variant text-center p-4">
            <span className="material-symbols-outlined text-[36px]">database_off</span>
            <span className="text-body-sm italic">No sensors registering active data.</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );

  return (
    <>
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/55 backdrop-blur-xs z-[90]" 
          onClick={() => setIsFullscreen(false)} 
        />
      )}
      {content}
    </>
  );
};
export default DashboardWidget;
