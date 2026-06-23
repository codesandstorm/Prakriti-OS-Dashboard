import React from 'react';
import { useStore } from '../hooks/useStore';
import { AlertCenterWidget, OfficerPanelWidget } from '../components/OperationalWidgets';
import { KpiCard } from '../components/KpiCard';

export const ActiveAlerts: React.FC = () => {
  const { incidents } = useStore();

  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL').length;
  const warningCount = incidents.filter(i => i.severity === 'WARNING').length;

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-surface-container-low text-on-surface">
      <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
        {/* Page Header */}
        <div className="flex justify-between items-end border-b border-outline-variant pb-4">
          <div>
            <h1 className="text-display-sm font-bold text-on-surface tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[32px]">notifications_active</span>
              Active Alerts Center
            </h1>
            <p className="text-sm font-mono-data text-on-surface-variant uppercase tracking-widest mt-1">
              Live Incident Management & Escalation Queue
            </p>
          </div>
          <div className="flex items-center gap-2">
             <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/30 rounded text-[10px] font-bold uppercase tracking-wider">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
               System Nominal
             </span>
          </div>
        </div>

        {/* Executive KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard 
            label="Total Active Alerts" 
            value={incidents.length.toString()} 
            trend="12%" trendDirection="down" 
            historicalComparison="12% from yesterday" 
            dataSource="Alert Bus" 
          />
          <KpiCard 
            label="Critical Severity" 
            value={criticalCount.toString()} 
            trend={criticalCount > 0 ? 'up' : 'down'} 
            trendDirection="up" historicalComparison="Needs Immediate Action" 
            dataSource="Telemetry Engine" 
            statusIndicator={criticalCount > 0 ? 'critical' : 'good'}
          />
          <KpiCard 
            label="Warning Severity" 
            value={warningCount.toString()} 
            trend="Monitoring" trendDirection="stable" 
            historicalComparison="Monitoring required" 
            dataSource="Telemetry Engine" 
            statusIndicator="fair"
          />
          <KpiCard 
            label="Avg Response SLA" 
            value="14m 22s" 
            trend="Needs Action" trendDirection="up" 
            historicalComparison="Target < 15m" 
            dataSource="Operations DB" 
            statusIndicator="good"
          />
        </div>

        {/* Primary Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-6">
            <AlertCenterWidget />
            
            {/* Live Alert Timeline Mock */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4 border-b border-outline-variant pb-2">Live Escalation Timeline</h3>
              <div className="space-y-4">
                {incidents.slice(0, 3).map((incident, i) => (
                  <div key={incident.id} className="flex gap-4 relative">
                    {i !== 2 && <div className="absolute left-2.5 top-6 bottom-[-16px] w-0.5 bg-outline-variant"></div>}
                    <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${incident.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'}`}>
                      <span className="w-2 h-2 rounded-full bg-surface"></span>
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant font-mono-data">{incident.time}</span>
                      <p className="text-sm font-semibold">{incident.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{incident.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-4">
             <OfficerPanelWidget />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActiveAlerts;
