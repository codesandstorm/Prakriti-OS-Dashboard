import React, { useState } from 'react';
import { WidgetCard } from './WidgetCard';

interface PowerBiChartCardProps {
  title: string;
  subtitle?: string;
  dataSource?: string;
  lastUpdated?: string;
  tooltipText?: string;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  colSpan?: number;
  minHeight?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  onTimeRangeChange?: (range: string) => void;
  isCrossFiltered?: boolean;
  onClearFilter?: () => void;
  confidence?: number;
  children: React.ReactNode;
}

export const PowerBiChartCard: React.FC<PowerBiChartCardProps> = ({
  title,
  subtitle,
  dataSource,
  lastUpdated,
  tooltipText,
  isLoading,
  isError,
  isEmpty,
  colSpan,
  minHeight = '300px',
  onRefresh,
  onExport,
  onTimeRangeChange,
  isCrossFiltered,
  onClearFilter,
  confidence,
  children
}) => {
  const [timeRange, setTimeRange] = useState('YTD');

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
    if (onTimeRangeChange) {
      onTimeRangeChange(e.target.value);
    }
  };

  const chartHeaderControls = (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-outline-variant bg-surface-container-low text-[10px]">
      {isCrossFiltered && (
        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
          <span className="material-symbols-outlined text-[12px]">filter_alt</span>
          <span className="font-bold uppercase tracking-wider">Cross-Filtered</span>
          {onClearFilter && (
            <button onClick={onClearFilter} className="hover:text-primary/70 ml-1">
              <span className="material-symbols-outlined text-[12px]">close</span>
            </button>
          )}
        </div>
      )}
      
      <div className="ml-auto flex items-center gap-2">
        <span className="text-on-surface-variant font-semibold uppercase">Time:</span>
        <select 
          value={timeRange} 
          onChange={handleTimeRangeChange}
          className="bg-surface border border-outline-variant text-on-surface rounded px-1.5 py-0.5 font-mono cursor-pointer hover:border-outline"
        >
          <option value="1M">1 Month</option>
          <option value="3M">3 Months</option>
          <option value="YTD">YTD</option>
          <option value="1Y">1 Year</option>
          <option value="5Y">5 Years</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className={`col-span-${colSpan || 12}`}>
      <WidgetCard
        title={title}
        subtitle={subtitle}
        dataSource={dataSource}
        lastUpdated={lastUpdated}
        tooltipText={tooltipText}
        isLoading={isLoading}
        isError={isError}
        isEmpty={isEmpty}
        confidence={confidence}
        onRefresh={onRefresh}
        onExport={onExport}
        minHeight={minHeight}
        noPadding={true}
      >
        <div className="flex flex-col h-full">
          {chartHeaderControls}
          <div className="flex-1 p-4 relative min-h-0 w-full">
            {children}
          </div>
        </div>
      </WidgetCard>
    </div>
  );
};
