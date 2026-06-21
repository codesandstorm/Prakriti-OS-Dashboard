import React from 'react';
import { mpVillages } from '../services/mpMockData';

export const MorningBriefing: React.FC = () => {
  const criticalVillages = mpVillages.filter(v => v.complianceState === 'CRITICAL');

  return (
    <div className="bg-surface border border-outline-variant p-6 rounded-lg h-full flex flex-col justify-between hover:shadow-md hover:border-primary transition-all select-none">
      <div className="space-y-4">
        {/* Title */}
        <div className="flex justify-between items-center pb-2 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">wb_sunny</span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Morning Briefing</h2>
          </div>
          <span className="text-[10px] bg-tertiary-fixed text-on-tertiary-fixed font-bold font-mono px-2 py-0.5 rounded">
            AI SYNTHESIS
          </span>
        </div>

        {/* Priority items */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">priority_high</span>
            <div>
              <span className="font-bold text-xs text-error block uppercase tracking-wider">Today's Priority</span>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Approve emergency forestry remediation grants for Dhar District to suppress localized canopy logging signals.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">insights</span>
            <div>
              <span className="font-bold text-xs text-primary block uppercase tracking-wider">District Summary</span>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Indore Sector reporting optimal AQI levels, but groundwater table indicators suggest localized depletion in Dhar agricultural blocks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Villages list */}
      <div className="mt-4 pt-4 border-t border-outline-variant grid grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-2">Critical Villages</span>
          <div className="flex flex-col gap-1.5">
            {criticalVillages.map(v => (
              <div key={v.id} className="flex justify-between items-center bg-error-container/20 border border-error/15 px-2 py-1 rounded text-body-sm">
                <span className="font-bold text-error">{v.name}</span>
                <span className="text-[10px] text-error font-mono font-bold">AQI {v.aqiScore}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-2">Pending Escalations</span>
          <div className="space-y-1.5 text-body-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-error" />
              <span>Dhar Wetland Audit (Sec. Sig.)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span>Officer Sharma task assign (24h)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MorningBriefing;
