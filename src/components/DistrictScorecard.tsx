import React from 'react';

export const DistrictScorecard: React.FC = () => {
  const districtScore = 78.4;
  const stateAverage = 71.2;
  const targetScore = 85.0;

  const strokeWidth = 7;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (districtScore / 100) * circumference;

  return (
    <div className="flex items-center gap-6">
      {/* SVG Gauge */}
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
        <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke="var(--color-surface-container)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke="var(--color-on-surface)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="gauge-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[20px] font-bold text-on-surface" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {districtScore}
          </span>
          <span className="text-[8px] text-on-surface-variant uppercase tracking-widest font-bold">
            Prakriti
          </span>
        </div>
      </div>

      {/* Comparison metrics */}
      <div className="flex-grow space-y-2 text-[11px]">
        <div className="flex justify-between border-b border-outline-variant pb-1.5">
          <span className="text-on-surface-variant">State Average</span>
          <span className="font-semibold text-on-surface" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{stateAverage}</span>
        </div>
        <div className="flex justify-between border-b border-outline-variant pb-1.5">
          <span className="text-on-surface-variant">District Target</span>
          <span className="font-semibold text-on-surface" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{targetScore}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Rank Index</span>
          <span className="font-semibold text-on-surface" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>#03 in State</span>
        </div>
      </div>
    </div>
  );
};

export default DistrictScorecard;
