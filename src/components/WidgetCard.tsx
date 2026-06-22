import React, { useState } from 'react';

interface WidgetCardProps {
  title: string;
  subtitle?: string;
  dataSource?: string;
  lastUpdated?: string;
  tooltipText?: string;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  confidence?: number;
  noPadding?: boolean;
  /** span across grid columns: 1-12 */
  colSpan?: number;
  /** minimum height */
  minHeight?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  children: React.ReactNode;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  subtitle,
  dataSource,
  lastUpdated = 'Just now',
  tooltipText,
  isLoading = false,
  isError = false,
  isEmpty = false,
  confidence,
  noPadding = false,
  minHeight,
  onRefresh,
  onExport,
  children
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Minimal simulated export behavior (Print screen or save CSV)
      window.print();
    }
  };

  const handleRefresh = () => {
    if (onRefresh) onRefresh();
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="widget-card animate-pulse" style={{ minHeight: minHeight || '180px' }}>
        <div className="widget-card-header">
          <div className="h-3 bg-surface-container-highest rounded w-1/3" />
          <div className="h-3 bg-surface-container-highest rounded w-1/6" />
        </div>
        <div className="widget-card-body flex flex-col justify-center gap-4">
          <div className="space-y-4 w-full px-2">
            <div className="h-4 bg-surface-container-highest rounded w-3/4 opacity-70" />
            <div className="h-4 bg-surface-container-highest rounded w-1/2 opacity-50" />
            <div className="h-16 bg-surface-container-highest rounded w-full opacity-30 mt-6" />
            <div className="h-3 bg-surface-container-highest rounded w-1/3 opacity-70 mt-4" />
          </div>
        </div>
        <div className="widget-card-footer border-t border-outline-variant">
          <div className="h-2 bg-surface-container-highest rounded w-1/4 opacity-50" />
        </div>
      </div>
    );
  }

  const containerClass = isExpanded
    ? 'widget-card widget-card-expanded'
    : 'widget-card';

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/40 z-[90]"
          onClick={() => setIsExpanded(false)}
        />
      )}
      <div
        className={containerClass}
        style={!isExpanded ? { minHeight: minHeight || undefined } : undefined}
      >
        {/* Header */}
        <div className="widget-card-header">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="widget-card-title">{title}</h3>
              {tooltipText && (
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-on-surface-variant hover:text-on-surface transition-colors"
                    aria-label="More information"
                  >
                    <span className="material-symbols-outlined text-[14px]">info</span>
                  </button>
                  {showTooltip && (
                    <div className="absolute left-0 top-6 w-52 bg-inverse-surface text-inverse-on-surface text-[10px] p-2.5 rounded shadow-lg z-50 leading-relaxed font-normal">
                      {tooltipText}
                    </div>
                  )}
                </div>
              )}
            </div>
            {subtitle && (
              <span className="text-[10px] text-on-surface-variant leading-none truncate">{subtitle}</span>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {confidence !== undefined && (
              <div 
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mr-1 border ${
                  confidence >= 95 ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                  confidence >= 80 ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                  'bg-red-500/10 text-red-600 border-red-500/20'
                }`}
                title={`Data Confidence Level: ${confidence}%`}
              >
                <span className="material-symbols-outlined text-[10px]">verified_user</span>
                {confidence}%
              </div>
            )}
            {onRefresh && (
              <button
                onClick={handleRefresh}
                className="widget-action-btn"
                title="Refresh Data"
                aria-label="Refresh Data"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
              </button>
            )}
            <button
              onClick={handleExport}
              className="widget-action-btn"
              title="Export Widget Data"
              aria-label="Export Widget Data"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="widget-action-btn"
              title={isExpanded ? 'Collapse Widget' : 'Expand Widget'}
              aria-label={isExpanded ? 'Collapse Widget' : 'Expand Widget'}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isExpanded ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={`${noPadding ? 'widget-card-body-flush' : 'widget-card-body'} overflow-x-auto overflow-y-auto`}>
          {isError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-2 border border-error/20">
                <span className="material-symbols-outlined text-[24px] text-error">sensors_off</span>
              </div>
              <div>
                <span className="text-body-sm font-bold text-on-surface block">Telemetry Stream Interrupted</span>
                <span className="text-xs text-on-surface-variant max-w-[200px] inline-block mt-1">Unable to establish secure connection with data pipeline.</span>
              </div>
              <button
                onClick={handleRefresh}
                className="mt-2 px-4 py-1.5 border border-outline bg-surface rounded text-[10px] font-bold uppercase text-on-surface hover:bg-surface-container hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">troubleshoot</span>
                Run Diagnostics
              </button>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-2 border border-outline-variant border-dashed">
                <span className="material-symbols-outlined text-[24px] text-on-surface-variant opacity-70">database</span>
              </div>
              <div>
                <span className="text-body-sm font-bold text-on-surface block">No Data Available</span>
                <span className="text-xs text-on-surface-variant max-w-[200px] inline-block mt-1">The requested telemetry parameters returned an empty dataset.</span>
              </div>
              <button
                onClick={handleRefresh}
                className="mt-2 px-4 py-1.5 border border-outline bg-surface rounded text-[10px] font-bold uppercase text-on-surface hover:bg-surface-container hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">tune</span>
                Configure Query
              </button>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer Metadata */}
        <div className="widget-card-footer">
          {dataSource && (
            <span className="truncate">Source: {dataSource}</span>
          )}
          <span className="ml-auto shrink-0">Updated {lastUpdated}</span>
        </div>
      </div>
    </>
  );
};

export default WidgetCard;
