import React from 'react';

export const DistrictScorecard: React.FC = () => {
  const districtScore = 78.4;
  const stateAverage = 71.2;
  const targetScore = 85.0;

  // Calculate arc dashoffset for dial gauge
  const strokeWidth = 8;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (districtScore / 100) * circumference;

  return (
    <div className="bg-white border border-outline-variant p-6 rounded-lg h-full flex flex-col justify-between hover:shadow-md hover:border-primary transition-all select-none">
      <div>
        <h3 className="font-label-md text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-4">
          District Environmental Health
        </h3>
        
        <div className="flex items-center gap-6">
          {/* SVG Gauge Dial */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full rotate-[-90deg]">
              {/* Background Dial Track */}
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-surface-container"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Active Dial Track */}
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-primary"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-display-lg text-primary">{districtScore}</span>
              <span className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">Prakriti</span>
            </div>
          </div>

          {/* KPI comparisons */}
          <div className="flex-grow space-y-2 text-xs">
            <div className="flex justify-between border-b border-outline-variant/30 pb-1">
              <span className="text-on-surface-variant">State Average:</span>
              <span className="font-bold text-on-surface">{stateAverage}</span>
            </div>
            <div className="flex justify-between border-b border-outline-variant/30 pb-1">
              <span className="text-on-surface-variant">District Target:</span>
              <span className="font-bold text-primary">{targetScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Rank Index:</span>
              <span className="font-bold text-secondary">#03 in State</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical progress bar tracker */}
      <div className="mt-4 pt-4 border-t border-outline-variant/50 space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase">
          <span>Historical Progress</span>
          <span className="text-primary">↑ 1.2% this quarter</span>
        </div>
        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
          <div className="bg-primary h-full w-[78%]" />
        </div>
      </div>
    </div>
  );
};
export default DistrictScorecard;
