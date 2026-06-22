import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import type { KpiMetric } from '../types';
import { useStore } from '../hooks/useStore';

interface ExtendedKpiProps extends KpiMetric {
  historicalComparison?: string;
  lastUpdated?: string;
  statusIndicator?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  tooltipText?: string;
  isLoading?: boolean;
  isErrorState?: boolean;
  isEmpty?: boolean;
  targetValue?: string | number;
  previousPeriodValue?: string | number;
  onDrillDown?: () => void;
  confidence?: number;
  dataSource?: string;
}

export const KpiCard: React.FC<ExtendedKpiProps> = ({
  value,
  trend,
  trendDirection,
  label,
  sparklineValues = [60, 65, 70, 72, 75, 78],
  historicalComparison = "vs. previous quarterly baseline",
  lastUpdated = "10m ago",
  statusIndicator = "good",
  tooltipText = "Calculated from environmental telemetry sensors.",
  isLoading = false,
  isErrorState = false,
  isEmpty = false,
  targetValue,
  previousPeriodValue,
  onDrillDown,
  confidence = 98,
  dataSource = "Telemetry Node"
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { addToast } = useStore();

  // Status Colors Mapping
  const statusColorMap = {
    excellent: 'bg-green-700',
    good: 'bg-green-500',
    fair: 'bg-yellow-500',
    poor: 'bg-orange-500',
    critical: 'bg-red-600',
  };

  const sparklineData = sparklineValues.map((v, i) => ({ value: v, index: i }));

  if (isLoading) {
    return (
      <div className="bg-white border border-outline-variant p-4 rounded-lg flex flex-col gap-3 animate-pulse h-[200px] justify-between">
        <div className="flex justify-between items-center">
          <div className="h-3.5 bg-surface-container-high rounded w-2/3" />
          <div className="h-4 w-4 bg-surface-container-high rounded-full" />
        </div>
        <div className="h-8 bg-surface-container-high rounded w-1/2" />
        <div className="h-8 bg-surface-container-high rounded w-full" />
        <div className="flex justify-between items-center">
          <div className="h-3 bg-surface-container-high rounded w-1/3" />
          <div className="h-3 bg-surface-container-high rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (isErrorState) {
    return (
      <div className="bg-white border border-red-200 p-4 rounded-lg flex flex-col gap-2 h-[200px] justify-between text-xs">
        <div className="flex justify-between items-center text-red-700 font-bold uppercase tracking-wider">
          <span>{label}</span>
          <span className="material-symbols-outlined text-[16px]">warning</span>
        </div>
        <div className="text-red-600 font-medium">Failed to retrieve telemetry stream.</div>
        <button className="text-left font-bold text-red-700 hover:underline cursor-pointer uppercase text-[9px] tracking-widest mt-2">
          Retry Connection
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-white border border-outline-variant p-4 rounded-lg flex flex-col gap-2 h-[200px] justify-between text-xs">
        <div className="flex justify-between items-center text-on-surface-variant uppercase tracking-wider font-bold">
          <span>{label}</span>
          <span className="material-symbols-outlined text-[16px]">hourglass_empty</span>
        </div>
        <div className="text-on-surface-variant italic">No data streams configured.</div>
        <span className="text-[9px] text-on-surface-variant uppercase tracking-wider">Empty State</span>
      </div>
    );
  }

  const badgeColorClass = statusColorMap[statusIndicator] || 'bg-green-500';
  const sparklineStroke = statusIndicator === 'critical' ? '#dc2626' : statusIndicator === 'excellent' ? '#15803d' : 'var(--color-primary)';

  return (
    <div className="group bg-white border border-outline-variant p-4 rounded-lg flex flex-col h-[200px] justify-between hover:border-primary transition-colors duration-200 relative select-none">
      
      {/* Top Details & Tooltips */}
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${badgeColorClass}`} title={`Status: ${statusIndicator}`} />
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider truncate max-w-[120px]">
              {label}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Tooltip trigger */}
            <div className="relative">
              <button 
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-on-surface-variant hover:text-primary transition-colors"
                title="Info"
              >
                <span className="material-symbols-outlined text-[14px]">info</span>
              </button>
              {showTooltip && (
                <div className="absolute right-0 top-5 w-48 bg-inverse-surface text-inverse-on-surface text-[10px] p-2.5 rounded shadow-lg z-50 leading-relaxed font-normal">
                  {tooltipText}
                  {targetValue !== undefined && <div className="mt-1 font-bold">Target: {targetValue}</div>}
                  {previousPeriodValue !== undefined && <div className="font-bold">Prev Period: {previousPeriodValue}</div>}
                </div>
              )}
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <div 
                className={`flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                  confidence >= 95 ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                  confidence >= 80 ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                  'bg-red-500/10 text-red-600 border-red-500/20'
                }`}
                title={`Confidence Score: ${confidence}%`}
              >
                <span className="material-symbols-outlined text-[9px]">verified_user</span>
                {confidence}%
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); window.print(); }}
                className="text-on-surface-variant hover:text-primary transition-colors"
                title="Export Metric"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary Metric Value */}
        <div className="text-headline-md font-bold text-on-surface font-mono-data leading-none pt-1">
          {value}
        </div>
      </div>

      {/* Recharts Mini Sparkline Graph */}
      <div className="h-12 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={sparklineStroke} 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trend & Historical Comparison */}
      <div className="text-[10px] leading-tight text-on-surface-variant mt-2">
        <div className="flex items-center gap-1 font-bold">
          <span className={`material-symbols-outlined text-[12px] ${trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-500' : 'text-yellow-500'}`}>
            {trendDirection === 'up' ? 'arrow_upward' : trendDirection === 'down' ? 'arrow_downward' : 'horizontal_rule'}
          </span>
          <span className={trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-500' : 'text-yellow-500'}>{trend}</span>
        </div>
        <span className="text-[9px] text-on-surface-variant/80 block mt-0.5">{historicalComparison}</span>
      </div>

      {/* Footer Area */}
      <div className="flex justify-between items-center text-[9px] border-t border-outline-variant/30 pt-2 text-on-surface-variant mt-auto">
        <div className="flex items-center gap-1.5 truncate pr-2">
          <span className="font-semibold">{dataSource}</span>
          <span>•</span>
          <span>Updated {lastUpdated}</span>
        </div>
        <button 
          onClick={onDrillDown ? onDrillDown : () => addToast(`Drilling down into telemetry charts for ${label}`, 'info')}
          className="flex items-center gap-0.5 text-primary font-bold uppercase hover:underline cursor-pointer"
        >
          <span>Drill Down</span>
          <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
        </button>
      </div>

    </div>
  );
};

export default KpiCard;
