import React from 'react';
import { useStore } from '../hooks/useStore';
import { villageProfiles } from '../services/villageMockData';
import { mpGisBoundaries } from '../services/gisMockData';

export const Villages: React.FC = () => {
  const { selectedVillageId, setSelectedVillageId } = useStore();

  const currentProfile = villageProfiles[selectedVillageId] || villageProfiles['VIL-001'];

  const handleExportPDF = () => {
    window.print();
  };

  const handleSelectVillage = (id: string) => {
    setSelectedVillageId(id);
  };

  const getPrakritiColorClass = (score: number) => {
    if (score >= 75) return 'text-primary border-primary';
    if (score >= 50) return 'text-yellow-500 border-yellow-500';
    return 'text-error border-error';
  };

  const getSeverityBadgeClass = (severity: 'CRITICAL' | 'WARNING' | 'STABLE') => {
    if (severity === 'CRITICAL') return 'bg-error-container/45 text-error border-error/30';
    if (severity === 'WARNING') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  // Find geographic bounds of village to render vector mini-map
  const matchingBound = mpGisBoundaries.find(b => b.name === currentProfile.name && b.type === 'village');

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-surface text-on-surface select-none">
      
      {/* Upper Control Bar */}
      <section className="bg-white border-b border-outline-variant px-gutter py-3.5 flex flex-wrap gap-4 items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[24px]">home_work</span>
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Select Village profile</span>
            <select
              value={currentProfile.id}
              onChange={(e) => handleSelectVillage(e.target.value)}
              className="bg-surface-container border border-outline-variant rounded px-3 py-1 text-sm font-bold text-on-surface cursor-pointer focus:ring-1 focus:ring-primary"
            >
              {Object.values(villageProfiles).map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.district})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            Export Health Card
          </button>
        </div>
      </section>

      {/* Main scrolling content area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Row 1: Passport Overview & Speedometer Dial */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Passport */}
          <div className="col-span-8 bg-white border border-outline-variant p-6 rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start pb-4 border-b border-outline-variant/60">
              <div>
                <span className="text-[10px] bg-secondary-container text-on-secondary-container font-bold font-mono px-2 py-0.5 rounded">
                  ENVIRONMENTAL PASSPORT
                </span>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-background mt-1.5">
                  Village {currentProfile.name}
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Block: <span className="font-semibold text-on-surface">{currentProfile.block}</span> | District: <span className="font-semibold text-on-surface">{currentProfile.district}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">BLOCK RANK</span>
                <span className="text-headline-md font-bold text-primary font-mono-data">
                  #{currentProfile.rankInBlock.toString().padStart(2, '0')}
                </span>
                <span className="text-body-xs text-on-surface-variant block">of {currentProfile.totalVillagesInBlock} villages</span>
              </div>
            </div>

            {/* Passport Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="p-3 bg-surface-container-low border border-outline-variant/50 rounded text-center">
                <span className="text-[10px] text-on-surface-variant block uppercase font-bold mb-1">Air Index (AQI)</span>
                <span className={`text-headline-sm font-bold font-mono-data ${currentProfile.passport.airQualityIndex > 150 ? 'text-error' : 'text-primary'}`}>
                  {currentProfile.passport.airQualityIndex}
                </span>
                <span className="text-body-xs text-on-surface-variant block mt-0.5">PM2.5 Daily Avg</span>
              </div>
              <div className="p-3 bg-surface-container-low border border-outline-variant/50 rounded text-center">
                <span className="text-[10px] text-on-surface-variant block uppercase font-bold mb-1">Groundwater Index</span>
                <span className="text-headline-sm font-bold font-mono-data text-secondary">
                  {currentProfile.passport.groundwaterIndex}/100
                </span>
                <span className="text-body-xs text-on-surface-variant block mt-0.5">Water Table Depth</span>
              </div>
              <div className="p-3 bg-surface-container-low border border-outline-variant/50 rounded text-center">
                <span className="text-[10px] text-on-surface-variant block uppercase font-bold mb-1">Soil Health Index</span>
                <span className="text-headline-sm font-bold font-mono-data text-tertiary">
                  {currentProfile.passport.soilHealthIndex}/100
                </span>
                <span className="text-body-xs text-on-surface-variant block mt-0.5">N-P-K Organic Trace</span>
              </div>
            </div>

            {/* Achievements row */}
            <div className="mt-4 p-3 bg-primary-container/20 border border-primary/10 rounded flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[20px]">workspace_premium</span>
              <div className="text-xs">
                <span className="font-bold text-primary block uppercase">Environmental Achievements</span>
                <p className="text-on-surface-variant font-medium">
                  {currentProfile.achievements.join(' • ')}
                </p>
              </div>
            </div>
          </div>

          {/* Prakriti Score Dial */}
          <div className="col-span-4 bg-white border border-outline-variant p-6 rounded-lg shadow-sm flex flex-col items-center justify-between text-center">
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">
              PRAKRITI SCORE
            </span>
            
            {/* Circle speedometer gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center mt-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="var(--color-surface-container-high)" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke={currentProfile.passport.prakritiScore >= 75 ? 'var(--color-primary)' : 'var(--color-error)'} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="264" 
                  strokeDashoffset={264 - (264 * currentProfile.passport.prakritiScore) / 100} 
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-headline-lg font-bold font-mono-data leading-none ${getPrakritiColorClass(currentProfile.passport.prakritiScore)}`}>
                  {currentProfile.passport.prakritiScore}
                </span>
                <span className="text-body-xs text-on-surface-variant font-bold mt-1">OPTIMAL INDEX</span>
              </div>
            </div>

            <p className="text-body-sm text-on-surface-variant italic mt-3">
              Score registers {currentProfile.passport.prakritiScore >= 75 ? 'Optimal' : 'Needs Intervention'} compared to State standards.
            </p>
          </div>
        </div>

        {/* Row 2: Timeline Trends & Mini Map boundary */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* YoY Trends Charts */}
          <div className="col-span-8 bg-white border border-outline-variant p-6 rounded-lg shadow-sm space-y-4">
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">
              Year-on-Year Score Trends
            </span>

            {/* Custom styled CSS chart bar grid */}
            <div className="h-44 flex items-end gap-6 justify-between pt-4 border-b border-outline-variant px-4">
              {currentProfile.history.map(hist => (
                <div key={hist.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="text-[10px] font-mono-data font-bold text-on-surface">{hist.score}</div>
                  
                  {/* Visual Bar representation */}
                  <div 
                    className="w-full bg-primary-container hover:bg-primary transition-all duration-300 rounded-t-sm" 
                    style={{ height: `${(hist.score / 100) * 120}px` }} 
                  />
                  
                  <span className="text-[10px] font-mono text-on-surface-variant font-bold">{hist.year}</span>
                </div>
              ))}
            </div>

            {/* Mini indicators */}
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="flex justify-between border-b border-outline-variant/30 pb-1.5">
                <span className="text-on-surface-variant">Groundwater table change:</span>
                <span className="font-bold text-on-surface">
                  -{currentProfile.history[0].groundwaterDepth}m → -{currentProfile.history[currentProfile.history.length - 1].groundwaterDepth}m
                </span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-1.5">
                <span className="text-on-surface-variant">Canopy coverage change:</span>
                <span className="font-bold text-primary">
                  {currentProfile.history[0].canopyPct}% → {currentProfile.history[currentProfile.history.length - 1].canopyPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Mini boundary map */}
          <div className="col-span-4 bg-white border border-outline-variant p-6 rounded-lg shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-2">
              Geographic Boundary Area
            </span>
            
            <div className="flex-1 min-h-[160px] bg-surface-container border border-outline-variant/60 rounded relative overflow-hidden flex items-center justify-center">
              {matchingBound ? (
                <svg className="w-40 h-40" viewBox="0 0 100 100">
                  <polygon 
                    points={matchingBound.coordinates.map(c => {
                      // Normalize to a 10-90 scale box
                      const x = 10 + ((c.lng - 75.05) / (76.15 - 75.05)) * 80;
                      const y = 90 - ((c.lat - 22.25) / (23.05 - 22.25)) * 80;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="rgba(168, 85, 247, 0.15)"
                    stroke="#A855F7"
                    strokeWidth="2"
                  />
                  <text x="50" y="55" textAnchor="middle" fill="#A855F7" fontSize="6" fontWeight="bold" className="uppercase">
                    {currentProfile.name} sector
                  </text>
                </svg>
              ) : (
                <span className="text-xs text-on-surface-variant italic">No boundary shape recorded.</span>
              )}
            </div>
            
            <p className="text-[11px] text-on-surface-variant mt-2 text-center">
              Coordinates: {matchingBound?.coordinates[0].lat.toFixed(4)}°N, {matchingBound?.coordinates[0].lng.toFixed(4)}°E
            </p>
          </div>
        </div>

        {/* Row 3: AI Recommendations & Inspections */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* AI Recommendations */}
          <div className="col-span-6 bg-white border border-outline-variant p-6 rounded-lg shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-3">
                AI Diagnostic Recommendations
              </span>
              <div className="space-y-3.5">
                {currentProfile.recommendations.map(rec => (
                  <div key={rec.id} className="p-3 border border-outline-variant bg-surface-container-low rounded-lg relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-primary uppercase">{rec.title}</span>
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 border rounded-full ${
                        rec.impact === 'HIGH' ? 'bg-error-container text-error border-error/30' : 'bg-blue-100 text-blue-800 border-blue-300'
                      }`}>
                        {rec.impact} IMPACT
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Environmental Risks & Notes */}
          <div className="col-span-6 bg-white border border-outline-variant p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-3">
                Risk Analysis
              </span>
              <div className="space-y-2.5">
                {currentProfile.risks.map(risk => (
                  <div key={risk.id} className={`p-3 border rounded border-outline-variant/60 flex items-start gap-3 ${getSeverityBadgeClass(risk.severity)}`}>
                    <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                      {risk.severity === 'CRITICAL' ? 'report_problem' : 'info'}
                    </span>
                    <div>
                      <span className="font-bold text-xs uppercase block tracking-wider mb-0.5">{risk.title}</span>
                      <p className="text-body-sm leading-tight opacity-90">{risk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-outline-variant/60 pt-4">
              <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-2">
                Field Officer Notes
              </span>
              <div className="space-y-2">
                {currentProfile.officerNotes.map((note, i) => (
                  <div key={i} className="bg-surface-container-low border border-outline-variant/50 p-2.5 rounded text-xs leading-relaxed">
                    <div className="flex justify-between font-bold text-[10px] text-on-surface-variant mb-1 font-mono">
                      <span>{note.officer}</span>
                      <span>{note.date}</span>
                    </div>
                    <p className="text-on-surface italic">"{note.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Inspection Logs */}
        <div className="bg-white border border-outline-variant p-6 rounded-lg shadow-sm">
          <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-3">
            Audit Inspection History
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant uppercase font-bold">
                  <th className="py-2">Inspection ID</th>
                  <th className="py-2">Audit Category</th>
                  <th className="py-2">Date Signed</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Assigned Inspector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50 font-medium">
                {currentProfile.inspections.map(isp => (
                  <tr key={isp.id} className="hover:bg-surface-container-low">
                    <td className="py-2.5 font-mono font-bold">{isp.id}</td>
                    <td className="py-2.5">{isp.category}</td>
                    <td className="py-2.5 font-mono">{isp.date}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                        isp.status === 'PASSED' ? 'bg-primary-container text-primary-fixed' : 'bg-error-container text-error'
                      }`}>
                        {isp.status}
                      </span>
                    </td>
                    <td className="py-2.5">{isp.inspector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Villages;
