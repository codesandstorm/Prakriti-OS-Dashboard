import React from 'react';
import { useStore } from '../hooks/useStore';
import { mockDistrictPerformance } from '../services/mpMockData';

export const BottomAnalyticsDock: React.FC = () => {
  const { 
    isDockExpanded, 
    setDockExpanded, 
    activeDockTab, 
    setActiveDockTab 
  } = useStore();

  const tabs = [
    { id: 'analytics', label: 'District Metrics', icon: 'table_chart' },
    { id: 'logs', label: 'Telemetry Logs', icon: 'list_alt' },
    { id: 'timeline', label: 'Incidents Timeline', icon: 'history' },
    { id: 'audit', label: 'Audit Trail', icon: 'security' },
    { id: 'downloads', label: 'Export Downloads', icon: 'download' },
    { id: 'performance', label: 'Sensors Health', icon: 'speed' }
  ] as const;

  const renderTabContent = () => {
    switch (activeDockTab) {
      case 'analytics':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest">
                <th className="p-3 border-b border-outline-variant text-label-md text-on-surface-variant text-[11px] font-bold">DISTRICT</th>
                <th className="p-3 border-b border-outline-variant text-label-md text-on-surface-variant text-[11px] font-bold">STATE</th>
                <th className="p-3 border-b border-outline-variant text-label-md text-on-surface-variant text-[11px] font-bold">AQI SCORE</th>
                <th className="p-3 border-b border-outline-variant text-label-md text-on-surface-variant text-[11px] font-bold">FOREST COVER %</th>
                <th className="p-3 border-b border-outline-variant text-label-md text-on-surface-variant text-[11px] font-bold">WATER INDEX</th>
                <th className="p-3 border-b border-outline-variant text-label-md text-on-surface-variant text-[11px] font-bold">COMPLIANCE</th>
              </tr>
            </thead>
            <tbody className="text-mono-data text-body-sm text-on-surface bg-white dark:bg-inverse-surface">
              {mockDistrictPerformance.map((row: any, idx: number) => {
                let aqiColor = 'text-primary-fixed-dim';
                if (row.aqi.includes('Poor') || row.aqi.includes('V. Poor')) {
                  aqiColor = 'text-error';
                } else if (row.aqi.includes('Fair')) {
                  aqiColor = 'text-on-secondary-container';
                }

                let badgeColor = 'bg-primary-container text-primary-fixed';
                if (row.compliance === 'CRITICAL') {
                  badgeColor = 'bg-error-container text-error';
                } else if (row.compliance === 'WARNING') {
                  badgeColor = 'bg-error-container/30 text-error';
                } else if (row.compliance === 'NEUTRAL') {
                  badgeColor = 'bg-secondary-container text-on-secondary-container';
                }

                return (
                  <tr key={idx} className="hover:bg-surface-container-low border-b border-outline-variant">
                    <td className="p-3 font-semibold">{row.district}</td>
                    <td className="p-3">{row.state}</td>
                    <td className={`p-3 font-bold ${aqiColor}`}>{row.aqi}</td>
                    <td className="p-3 font-mono">{row.forestCover}</td>
                    <td className="p-3 font-mono">{row.waterIndex}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${badgeColor}`}>
                        {row.compliance}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );

      case 'logs':
        return (
          <div className="flex flex-col gap-2 font-mono-data text-[11px] text-on-surface-variant px-2 py-1 select-text">
            <div>[02:45 AM] SYS-SECURE: Satpura range C-2 thermal telemetry active. Data package synced.</div>
            <div>[01:12 AM] SENSOR-NARMADA-412: Downstream volumetric discharge registers 1240 cusec.</div>
            <div>[00:05 AM] BHO-POLLUTION-9: Calibration check complete for monitoring sector Alpha.</div>
            <div>[23:45 PM] AUTH-DAEMON: Dynamic collector access session token issued for secure tunnel.</div>
          </div>
        );

      case 'timeline':
        return (
          <div className="flex flex-col gap-4 p-2 relative border-l border-outline-variant ml-4 text-xs">
            <div className="relative pl-6">
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-error" />
              <div className="font-bold">Illegal Logging Alert (INC-MP-201)</div>
              <div className="text-on-surface-variant text-[11px]">02:45 AM - Response Forces dispatched for Satpura forest quadrant.</div>
            </div>
            <div className="relative pl-6">
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <div className="font-bold">Downstream Level Drops Alert (INC-MP-202)</div>
              <div className="text-on-surface-variant text-[11px]">01:45 AM - Hydrology Delta unit assigned to check Narmada checkdam valves.</div>
            </div>
          </div>
        );

      case 'audit':
        return (
          <div className="flex flex-col gap-2 font-mono-data text-body-sm text-on-surface-variant p-2 select-text">
            <div>Collector (MP-ADMIN-01) performed GIS layer filter switch (checked Forestry cover, Hydrology cover).</div>
            <div>Auth Role token context switched to Chief Forest Conservator Arjun Sharma.</div>
            <div>Automated AI prediction run executed on ECO-FORECAST-v4 dataset.</div>
          </div>
        );

      case 'downloads':
        return (
          <div className="p-4 flex gap-4 text-body-sm font-bold">
            <button onClick={() => alert("Downloading district metrics as CSV...")} className="px-4 py-2 bg-primary text-on-primary rounded flex items-center gap-2 hover:bg-primary-container transition-colors">
              <span className="material-symbols-outlined">download</span> Download Metrics CSV
            </button>
            <button onClick={() => alert("Downloading GIS layer package...")} className="px-4 py-2 border border-outline-variant text-on-surface rounded flex items-center gap-2 hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">layers</span> Export GIS Layer SHP
            </button>
          </div>
        );

      case 'performance':
        return (
          <div className="grid grid-cols-4 gap-4 p-2 text-center text-xs">
            <div className="p-3 border border-outline-variant rounded bg-white dark:bg-inverse-surface">
              <span className="text-on-surface-variant block mb-1">Thermal Sensor Nodes</span>
              <span className="text-headline-sm font-bold text-green-500">98.4% OK</span>
            </div>
            <div className="p-3 border border-outline-variant rounded bg-white dark:bg-inverse-surface">
              <span className="text-on-surface-variant block mb-1">Hydrological Telemetry</span>
              <span className="text-headline-sm font-bold text-green-500">100% OK</span>
            </div>
            <div className="p-3 border border-outline-variant rounded bg-white dark:bg-inverse-surface">
              <span className="text-on-surface-variant block mb-1">Satellite Upstream sync</span>
              <span className="text-headline-sm font-bold text-[#F59E0B]">LATENCY 1.2s</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface text-on-surface select-none">
      
      {/* Dock tab navigation bar */}
      <div 
        className="h-10 flex items-center justify-between border-b border-outline-variant bg-surface-container-low select-none shrink-0"
      >
        <div className="flex items-center h-full">
          {/* Main Toggle Button */}
          <button 
            onClick={() => setDockExpanded(!isDockExpanded)}
            className="h-full px-4 flex items-center gap-2 hover:bg-surface-container-high border-r border-outline-variant text-on-surface font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">table_chart</span>
            <span className="text-xs uppercase font-bold tracking-wider">Metrics Console</span>
            <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isDockExpanded ? 'rotate-180' : ''}`}>
              keyboard_arrow_up
            </span>
          </button>

          {/* Sub tabs selectors */}
          {isDockExpanded && (
            <div className="flex h-full items-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDockTab(tab.id)}
                  className={`h-full px-4 flex items-center gap-1.5 text-xs font-bold transition-colors border-r border-outline-variant/50 ${
                    activeDockTab === tab.id 
                      ? 'bg-white dark:bg-inverse-surface text-primary border-b-2 border-b-primary font-extrabold' 
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {isDockExpanded && (
          <span className="text-[10px] text-on-surface-variant font-mono-data pr-4 select-text">
            Telemetry Database V2.1 • Madhya Pradesh Region
          </span>
        )}
      </div>

      {/* Dock View Area */}
      <div className={`flex-grow overflow-auto p-4 bg-white dark:bg-inverse-surface ${isDockExpanded ? 'block' : 'hidden'}`}>
        {renderTabContent()}
      </div>

    </div>
  );
};
export default BottomAnalyticsDock;
