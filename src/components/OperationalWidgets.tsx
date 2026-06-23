import React, { useState } from 'react';
import { WidgetCard } from './WidgetCard';
import { useStore } from '../hooks/useStore';
import { mpOfficers } from '../services/mpMockData';

// -----------------------------------------------------------
// 1. Officer Panel
// -----------------------------------------------------------
export const OfficerPanelWidget: React.FC = () => {
  const { addToast, presentationMode, setProcessing } = useStore();
  return (
    <WidgetCard
      title="Field Operations Command"
      subtitle="Live officer status and task queues"
      dataSource="Officer GPS Tracker"
      lastUpdated="Live"
      confidence={92}
      tooltipText="Real-time location, current assignments, and performance metrics for active field personnel."
      noPadding
    >
      <table className="enterprise-table">
        <thead>
          <tr>
            <th>Officer</th>
            <th>Live GPS Status</th>
            <th>Pending Visits</th>
            <th>Completed</th>
            <th>Performance</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {mpOfficers.map(officer => {
            const isField = officer.status === 'ON-FIELD';
            const isCritical = officer.perfScore < 80;
            return (
              <tr key={officer.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-surface-container overflow-hidden shrink-0">
                      <img src={officer.avatarUrl} alt={officer.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-semibold block">{officer.name}</span>
                      <span className="text-[10px] text-on-surface-variant block">{officer.designation}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isField ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                    <span className="text-[11px] uppercase tracking-wider">{officer.status}</span>
                  </div>
                  <span className="text-[9px] text-on-surface-variant block mt-0.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {officer.lastActivityLocation}
                  </span>
                </td>
                <td className="cell-mono text-amber-600 font-bold">{Math.floor(Math.random() * 5) + 1}</td>
                <td className="cell-mono">{officer.reportsSubmitted}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isCritical ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${officer.perfScore}%` }} 
                      />
                    </div>
                    <span className="cell-mono">{officer.perfScore}</span>
                  </div>
                </td>
                <td>
                  <button 
                    onClick={() => {
                      setProcessing(true, `Connecting to Field Comm for ${officer.name}...`);
                      setTimeout(() => {
                        setProcessing(false);
                        addToast(`Dispatched Officer ${officer.name} to field.`, 'success');
                      }, 1500);
                    }}
                    disabled={presentationMode}
                    className="text-[10px] font-bold text-primary uppercase hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Dispatch
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </WidgetCard>
  );
};

// -----------------------------------------------------------
// 2. Alert Center Widget
// -----------------------------------------------------------
export const AlertCenterWidget: React.FC = () => {
  const { incidents, resolveIncident, escalateIncident, assignIncident, addToast, setSelectedIncident, presentationMode, setProcessing } = useStore();

  const handleResolve = (id: string) => {
    if (presentationMode) { addToast("Locked in Presentation Mode", "error"); return; }
    setProcessing(true, "Resolving Incident...");
    setTimeout(() => {
      resolveIncident(id);
      addToast('Incident successfully resolved and logged.', 'success');
      setProcessing(false);
    }, 1500);
  };

  const handleEscalate = (id: string) => {
    if (presentationMode) { addToast("Locked in Presentation Mode", "error"); return; }
    setProcessing(true, "Escalating Alert to CRITICAL...");
    setTimeout(() => {
      escalateIncident(id);
      addToast('Incident escalated to CRITICAL severity.', 'error');
      setProcessing(false);
    }, 1200);
  };

  const handleAssign = (id: string) => {
    if (presentationMode) { addToast("Locked in Presentation Mode", "error"); return; }
    setProcessing(true, "Dispatching Nearest Available Officer...");
    setTimeout(() => {
      assignIncident(id, 'OFC-001'); // arbitrary assignment for demo
      addToast('Officer assigned to incident.', 'success');
      setProcessing(false);
    }, 1800);
  };

  return (
    <WidgetCard
      title="Alert Center"
      subtitle="Actionable environmental and system alerts"
      dataSource="Unified Alert Bus"
      lastUpdated="Live"
      confidence={99}
      tooltipText="High-priority system anomalies and field incidents requiring immediate intervention."
    >
      <div className="space-y-3">
        {incidents.length === 0 && (
          <div className="py-8 text-center text-on-surface-variant italic text-[12px]">
            No active alerts. System nominal.
          </div>
        )}
        {incidents.map(alert => {
          const isCritical = alert.severity === 'CRITICAL';
          const isHigh = alert.severity === 'WARNING';
          
          let severityColor = 'bg-surface-container border-outline-variant';
          if (isCritical) severityColor = 'bg-red-500/10 border-red-500/30';
          if (isHigh) severityColor = 'bg-amber-500/10 border-amber-500/30';

          return (
            <div key={alert.id} className={`p-3 rounded-lg border ${severityColor} flex flex-col gap-2`}>
              <div className="flex justify-between items-start">
                <div className="flex gap-2 items-center">
                  <span className={`material-symbols-outlined text-[16px] ${isCritical ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-primary'}`}>
                    {isCritical ? 'error' : 'warning'}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isCritical ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-primary'}`}>
                    {alert.severity}
                  </span>
                </div>
                <span className="text-[9px] text-on-surface-variant" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{alert.time}</span>
              </div>
              <div>
                <span className="font-semibold text-[13px] text-on-surface block leading-snug">{alert.title}</span>
                <span className="text-[11px] text-on-surface-variant block mt-0.5">{alert.description}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-outline-variant/30">
                <button onClick={() => { handleEscalate(alert.id); }} disabled={presentationMode} className="px-3 py-1 bg-surface text-on-surface border border-outline-variant rounded font-bold text-[9px] uppercase tracking-wider hover:bg-surface-container transition-colors disabled:opacity-50">
                  Escalate
                </button>
                <button onClick={() => { handleAssign(alert.id); }} disabled={presentationMode} className="px-3 py-1 bg-surface text-on-surface border border-outline-variant rounded font-bold text-[9px] uppercase tracking-wider hover:bg-surface-container transition-colors disabled:opacity-50">
                  Assign
                </button>
                <button onClick={() => setSelectedIncident(alert)} className="px-3 py-1 bg-surface text-on-surface border border-outline-variant rounded font-bold text-[9px] uppercase tracking-wider hover:bg-surface-container transition-colors">
                  Details
                </button>
                <button 
                  onClick={() => handleResolve(alert.id)}
                  disabled={presentationMode}
                  className="ml-auto px-3 py-1 bg-primary text-on-primary rounded font-bold text-[9px] uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Resolve
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
};

// -----------------------------------------------------------
// 3. Decision Centre Widget
// -----------------------------------------------------------
export const DecisionCentreWidget: React.FC = () => {
  const { collectorNotes, setCollectorNotes, addToast, addOfficerAudit, presentationMode, setProcessing } = useStore();
  const [draftNote, setDraftNote] = useState(collectorNotes);

  const [decisions, setDecisions] = useState([
    { id: 1, type: 'Order', title: 'Suspend Sector 4 Mining Operations', status: 'Pending Signature', date: 'Today, 10:00 AM' },
    { id: 2, type: 'Approval', title: 'Q3 Afforestation Budget Allocation', status: 'Ready for Review', date: 'Yesterday' },
    { id: 3, type: 'Policy', title: 'Implement Emergency AQI Protocol', status: 'Active', date: 'Mon, 14 Aug' },
  ]);

  const handleSaveNote = () => {
    if (presentationMode) { addToast("Locked in Presentation Mode", "error"); return; }
    setProcessing(true, "Encrypting & Saving Note...");
    setTimeout(() => {
      setCollectorNotes(draftNote);
      addToast('Collector scratchpad saved securely.', 'success');
      setProcessing(false);
    }, 1000);
  };

  const handleAction = (id: number, type: string) => {
    if (presentationMode) { addToast("Locked in Presentation Mode", "error"); return; }
    setProcessing(true, `Processing ${type} Action...`);
    setTimeout(() => {
      setDecisions(decisions.filter(d => d.id !== id));
      addToast(`${type} executed and logged to audit trail.`, 'success');
      addOfficerAudit({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: `${type} Executed`,
        actor: 'Collector',
        officerId: 'COL-001',
        details: `Action ID ${id} finalized.`
      });
      setProcessing(false);
    }, 1800);
  };

  return (
    <WidgetCard
      title="Decision Centre"
      subtitle="Collector notes, orders, and approvals"
      dataSource="Executive Action Log"
      lastUpdated="5m ago"
      confidence={100}
      tooltipText="Cryptographically signed ledger of Collector orders, directives, and approvals."
    >
      <div className="space-y-4">
        {/* Collector Note input simulation */}
        <div className="bg-surface-container-low border border-outline-variant p-3 rounded">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Collector's Scratchpad</span>
          <textarea 
            placeholder="Draft new order or operational note..." 
            className="w-full bg-transparent border-none focus:ring-0 text-[12px] text-on-surface resize-none p-0 placeholder:text-on-surface-variant/50"
            rows={2}
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button onClick={handleSaveNote} disabled={presentationMode} className="text-[10px] font-bold text-primary uppercase disabled:opacity-50">Save Note</button>
          </div>
        </div>

        {/* Action Items */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">Pending Actions</span>
          {decisions.map(d => (
            <div key={d.id} className="flex items-center justify-between p-2 border-b border-outline-variant last:border-b-0">
              <div>
                <span className="text-[9px] bg-surface-container px-1.5 py-0.5 rounded font-bold uppercase tracking-wider mr-2">{d.type}</span>
                <span className="text-[12px] font-semibold text-on-surface">{d.title}</span>
                <span className="text-[10px] text-on-surface-variant block mt-0.5">{d.date}</span>
              </div>
              <button 
                onClick={() => handleAction(d.id, d.status === 'Pending Signature' ? 'Sign' : 'Review')}
                disabled={presentationMode}
                className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded font-bold text-[9px] uppercase tracking-wider hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {d.status === 'Pending Signature' ? 'Sign' : 'Review'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
};
