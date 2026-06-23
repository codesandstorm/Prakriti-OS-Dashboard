import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';

export const AlertStrip: React.FC = () => {
  const { incidents, setSelectedIncident, setCurrentPage } = useStore();
  const [acknowledgedList, setAcknowledgedList] = useState<string[]>([]);

  // Filter out resolved or acknowledged incidents
  const activeIncidents = incidents.filter(
    (inc) => inc.severity === 'CRITICAL' && !acknowledgedList.includes(inc.id)
  );

  const handleAcknowledge = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAcknowledgedList([...acknowledgedList, id]);
  };

  const handleInspect = (inc: any) => {
    setSelectedIncident(inc);
    setCurrentPage('active-alerts');
  };

  if (activeIncidents.length === 0) return null;

  // Render the most urgent critical incident
  const currentIncident = activeIncidents[0];

  return (
    <div 
      onClick={() => handleInspect(currentIncident)}
      className="bg-error border-b border-outline-variant px-gutter py-2 flex justify-between items-center text-white cursor-pointer select-none"
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[20px] animate-pulse">dangerous</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs bg-white text-error px-1.5 py-0.5 rounded font-mono">
            CRITICAL
          </span>
          <span className="text-body-sm font-bold truncate max-w-2xl">
            {currentIncident.title}: {currentIncident.description}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono-data opacity-90">{currentIncident.coordinates}</span>
        <button 
          onClick={(e) => handleAcknowledge(currentIncident.id, e)}
          className="bg-white/20 hover:bg-white/35 border border-white/50 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};
export default AlertStrip;
