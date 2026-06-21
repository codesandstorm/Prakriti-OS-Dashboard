import React from 'react';

// 1. Line Chart: 10-Year Air Quality Trends
export const AirQualityTrendChart: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full justify-between pb-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">10-Year Air Quality Trends</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-primary rounded-full"></span>
            <span className="font-label-md text-on-surface-variant uppercase text-xs">PM2.5</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-secondary rounded-full"></span>
            <span className="font-label-md text-on-surface-variant uppercase text-xs">NO2</span>
          </div>
        </div>
      </div>
      <div className="flex-1 relative border-l border-b border-outline-variant ml-8 mb-6 h-40">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-20 pointer-events-none">
          <div className="h-px bg-outline"></div>
          <div className="h-px bg-outline"></div>
          <div className="h-px bg-outline"></div>
          <div className="h-px bg-outline"></div>
        </div>
        
        {/* Render lines via vector SVG paths */}
        <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 800 200">
          {/* PM2.5 Path */}
          <path 
            d="M0,150 L100,140 L200,160 L300,130 L400,110 L500,120 L600,80 L700,95 L800,60" 
            fill="none" 
            stroke="#003527" 
            strokeWidth="3"
          />
          {/* NO2 Path */}
          <path 
            d="M0,180 L100,170 L200,175 L300,160 L400,150 L500,140 L600,135 L700,120 L800,110" 
            fill="none" 
            stroke="#006399" 
            strokeDasharray="4" 
            strokeWidth="3"
          />
        </svg>

        {/* X Axis labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between font-label-md text-on-surface-variant text-[11px]">
          <span>2014</span><span>2016</span><span>2018</span><span>2020</span><span>2022</span><span>2024</span>
        </div>
        {/* Y Axis labels */}
        <div className="absolute -left-10 h-full flex flex-col justify-between items-end font-label-md text-on-surface-variant text-[11px] pr-2">
          <span>200</span><span>150</span><span>100</span><span>50</span><span>0</span>
        </div>
      </div>
    </div>
  );
};

// 2. Treemap: Carbon Footprint by Sector
export const CarbonFootprintTreemap: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">
        Carbon Footprint by Sector
      </h3>
      <div className="flex-1 grid grid-cols-6 grid-rows-6 gap-1 min-h-[160px]">
        {/* Manufacturing - 42% */}
        <div className="col-span-3 row-span-4 bg-primary p-2 text-white flex flex-col justify-between rounded-sm">
          <span className="font-label-md opacity-80 text-xs uppercase">Manufacturing</span>
          <span className="font-bold text-lg">42%</span>
        </div>
        
        {/* Energy - 18% */}
        <div className="col-span-3 row-span-2 bg-primary-container p-2 text-white flex flex-col justify-between rounded-sm">
          <span className="font-label-md opacity-80 text-xs uppercase">Energy</span>
          <span className="font-bold text-md">18%</span>
        </div>
        
        {/* Transport - 12% */}
        <div className="col-span-2 row-span-2 bg-secondary p-2 text-white flex flex-col justify-between rounded-sm">
          <span className="font-label-md opacity-80 text-xs uppercase">Transport</span>
          <span className="font-bold text-md">12%</span>
        </div>
        
        {/* Agri - 8% */}
        <div className="col-span-1 row-span-2 bg-secondary-container p-2 text-on-secondary-container flex flex-col justify-between rounded-sm">
          <span className="font-label-md opacity-80 text-xs uppercase">Agri</span>
          <span className="font-bold text-md">8%</span>
        </div>
        
        {/* Other - 20% */}
        <div className="col-span-3 row-span-2 bg-surface-container-highest p-2 border border-outline-variant flex flex-col justify-between rounded-sm">
          <span className="font-label-md text-on-surface-variant text-xs uppercase">Other</span>
          <span className="font-bold text-on-surface text-md">20%</span>
        </div>
      </div>
    </div>
  );
};

// 3. Forecast Prediction Bar Chart
export const ForecastPredictionChart: React.FC = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Predictive Modeling: PM2.5 (2025-2026)
          </h3>
          <div className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            AI ENHANCED
          </div>
        </div>
      </div>
      
      <div className="h-48 flex items-end gap-2 px-4 relative">
        {/* Grid lines and prediction threshold */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none pb-8">
          <div className="h-px bg-outline"></div>
          <div className="h-px bg-outline"></div>
          <div className="h-px bg-outline"></div>
        </div>

        {/* Historical Bars */}
        <div className="flex-1 bg-outline-variant h-[60%] relative group rounded-t-xs hover:bg-primary transition-colors cursor-pointer">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-on-background text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
            112
          </div>
        </div>
        <div className="flex-1 bg-outline-variant h-[58%] rounded-t-xs"></div>
        <div className="flex-1 bg-outline-variant h-[62%] rounded-t-xs"></div>
        <div className="flex-1 bg-outline-variant h-[65%] rounded-t-xs"></div>
        
        {/* Prediction Threshold Line */}
        <div className="w-px h-full bg-tertiary-container mx-2 relative flex justify-center">
          <span className="absolute top-0 bg-tertiary-container text-on-tertiary text-[9px] px-2 py-0.5 rounded whitespace-nowrap font-bold">
            PREDICTION LINE
          </span>
        </div>
        
        {/* Forecasted AI Bars */}
        <div className="flex-1 bg-tertiary-fixed-dim h-[68%] relative rounded-t-xs group cursor-pointer hover:bg-tertiary transition-colors">
          <span className="material-symbols-outlined absolute -top-5 left-1/2 -translate-x-1/2 text-tertiary text-[16px] animate-pulse">
            error
          </span>
        </div>
        <div className="flex-1 bg-tertiary-fixed-dim h-[72%] rounded-t-xs"></div>
        <div className="flex-1 bg-tertiary-fixed-dim h-[75%] rounded-t-xs"></div>
        <div className="flex-1 bg-tertiary-fixed-dim h-[70%] rounded-t-xs"></div>
        <div className="flex-1 bg-tertiary-fixed-dim h-[65%] rounded-t-xs"></div>
      </div>
      
      <div className="flex justify-between mt-4 px-4 text-label-md text-on-surface-variant text-[11px]">
        <span>AUG 2024</span>
        <span>DEC 2024</span>
        <span className="text-tertiary font-bold">MAR 2025 (EST)</span>
        <span>JUN 2025 (EST)</span>
        <span>SEP 2025 (EST)</span>
      </div>
    </div>
  );
};
