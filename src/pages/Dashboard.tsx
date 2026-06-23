import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../hooks/useStore';
import { WidgetCard } from '../components/WidgetCard';
import { DistrictScorecard } from '../components/DistrictScorecard';
import { OfficerPanelWidget, AlertCenterWidget, DecisionCentreWidget } from '../components/OperationalWidgets';
import { mpVillages } from '../services/mpMockData';
import { initialAuditLogs } from '../services/officerWorkflowMock';
import type { UserRole } from '../types';

// -----------------------------------------------------------
// Section Divider (reusable label + line)
// -----------------------------------------------------------
const SectionDivider: React.FC<{ label: string; icon?: string }> = ({ label, icon }) => (
  <div className="section-divider">
    {icon && <span className="material-symbols-outlined text-[14px] text-on-surface-variant">{icon}</span>}
    <span className="section-divider-label">{label}</span>
    <span className="section-divider-line" />
  </div>
);

// -----------------------------------------------------------
// Severity badge utility
// -----------------------------------------------------------
const severityBadge = (level: string) => {
  const map: Record<string, string> = {
    'OPTIMAL': 'status-badge status-badge-good',
    'WARNING': 'status-badge status-badge-fair',
    'CRITICAL': 'status-badge status-badge-critical',
    'NEUTRAL': 'status-badge status-badge-neutral',
    'ACTIVE': 'status-badge status-badge-good',
    'ON-FIELD': 'status-badge status-badge-excellent',
    'INACTIVE': 'status-badge status-badge-neutral',
  };
  return map[level] || 'status-badge status-badge-neutral';
};

// -----------------------------------------------------------
// Operations Toolbar Component
// -----------------------------------------------------------
const OperationsToolbar: React.FC = () => {
  const { currentRole, setCurrentRole, presentationMode, setPresentationMode } = useStore();
  const roles: UserRole[] = ['Collector', 'Officer', 'Administrator', 'Research'];

  return (
    <div className="col-span-12 bg-surface-container-low border border-outline-variant p-2 rounded-lg flex flex-wrap items-center justify-between gap-4 mb-2 shadow-sm z-10 sticky top-0">
      <div className="flex items-center gap-3 flex-1 min-w-[300px]">
        {/* Search */}
        <div className="flex items-center gap-1.5 bg-surface border border-outline-variant rounded px-2.5 py-1.5 flex-1 max-w-sm">
          <span className="material-symbols-outlined text-on-surface-variant text-[16px]">search</span>
          <input 
            type="text" 
            placeholder="Search operations, officers, alerts..." 
            className="bg-transparent focus:outline-none text-[12px] text-on-surface w-full placeholder:text-on-surface-variant/70"
          />
        </div>
        
        {/* Filters & Views */}
        <button className="flex items-center gap-1.5 px-3 py-1 bg-surface border border-outline-variant text-on-surface rounded font-semibold text-[11px] hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-[14px]">filter_list</span> Advanced Filters
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1 bg-surface border border-outline-variant text-on-surface rounded font-semibold text-[11px] hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-[14px]">bookmark</span> Saved Views
        </button>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Role Selector (For demo purposes) */}
        <div className="flex items-center gap-2 border-r border-outline-variant pr-3">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Role:</span>
          <select 
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="bg-surface border border-outline-variant text-on-surface rounded px-2 py-1 text-[11px] font-semibold cursor-pointer focus:ring-primary"
          >
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Actions */}
        <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors px-2 py-1" title="Export Data" aria-label="Export Dashboard Data">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">download</span>
        </button>
        <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors px-2 py-1" title="Print Report" aria-label="Print Dashboard Report">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">print</span>
        </button>
        <button 
          onClick={() => setPresentationMode(!presentationMode)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold text-[10px] uppercase tracking-wider transition-colors ${
            presentationMode ? 'bg-primary text-on-primary' : 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container'
          }`}
          aria-label="Toggle Presentation Mode"
        >
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">{presentationMode ? 'close_fullscreen' : 'presentation_up'}</span>
          Present
        </button>
      </div>
    </div>
  );
};



export const Dashboard: React.FC = () => {
  const { currentRole, presentationMode } = useStore();

  // GIS Canvas state
  const [activeGisLayer, setActiveGisLayer] = useState<'prakriti' | 'ndvi' | 'groundwater' | 'carbon' | 'forest'>('prakriti');
  const [layerOpacity] = useState(0.85);
  const [zoomLevel] = useState(12);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedMapEntity, setSelectedMapEntity] = useState<string | null>('Mhow Sector C');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Time display
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  // -----------------------------------------------------------
  // GIS Canvas Rendering
  // -----------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const parent = canvas.parentElement;
    canvas.width = parent?.clientWidth || 700;
    canvas.height = parent?.clientHeight || 400;

    // Dark radar base
    ctx.fillStyle = '#0c0f11';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2 + panOffset.x, canvas.height / 2 + panOffset.y);
    ctx.scale(zoomLevel / 12, zoomLevel / 12);

    // Grid overlay
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 0.5;
    for (let x = -800; x <= 800; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, -600); ctx.lineTo(x, 600); ctx.stroke();
    }
    for (let y = -600; y <= 600; y += 40) {
      ctx.beginPath(); ctx.moveTo(-800, y); ctx.lineTo(800, y); ctx.stroke();
    }

    // District boundary polygon
    ctx.beginPath();
    ctx.moveTo(-150, -100); ctx.lineTo(150, -120); ctx.lineTo(200, 100);
    ctx.lineTo(-50, 160); ctx.lineTo(-180, 80); ctx.closePath();
    ctx.strokeStyle = 'rgba(148,163,184,0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Choropleth fill
    const fillGrad = ctx.createRadialGradient(0, 0, 50, 0, 0, 250);
    const layerColors: Record<string, [string, string]> = {
      prakriti: [`rgba(21,80,45,${layerOpacity})`, `rgba(220,38,38,${layerOpacity * 0.6})`],
      ndvi: [`rgba(16,185,129,${layerOpacity})`, `rgba(6,78,59,${layerOpacity})`],
      groundwater: [`rgba(14,165,233,${layerOpacity})`, `rgba(3,105,161,${layerOpacity})`],
      carbon: [`rgba(120,80,60,${layerOpacity})`, `rgba(80,50,30,${layerOpacity})`],
      forest: [`rgba(52,211,153,${layerOpacity})`, `rgba(4,120,87,${layerOpacity})`],
    };
    const [c1, c2] = layerColors[activeGisLayer] || layerColors.prakriti;
    fillGrad.addColorStop(0, c1);
    fillGrad.addColorStop(1, c2);
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // River network
    ctx.beginPath();
    ctx.moveTo(-120, -90); ctx.bezierCurveTo(-20, -50, 40, 20, 120, 140);
    ctx.strokeStyle = 'rgba(37,99,235,0.4)'; ctx.lineWidth = 2; ctx.stroke();

    // Selected entity highlight
    if (selectedMapEntity) {
      ctx.beginPath(); ctx.arc(40, -20, 45, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '700 8px "IBM Plex Mono", monospace';
      ctx.fillText(selectedMapEntity.toUpperCase(), 48, -28);
    }

    // Officer marker
    ctx.fillStyle = 'rgba(148,163,184,0.9)';
    ctx.beginPath(); ctx.arc(-80, 40, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '600 7px "IBM Plex Mono", monospace';
    ctx.fillText('OFFICER ARJUN', -120, 32);

    ctx.restore();

    // Scale bar
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(20, canvas.height - 28, 60, 1);
    ctx.fillRect(20, canvas.height - 32, 1, 5);
    ctx.fillRect(80, canvas.height - 32, 1, 5);
    ctx.font = '600 7px "IBM Plex Mono", monospace';
    ctx.fillText('5 KM', 30, canvas.height - 16);
  }, [activeGisLayer, layerOpacity, zoomLevel, panOffset, selectedMapEntity]);

  // Canvas interaction handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    setPanOffset(prev => ({
      x: prev.x + (e.clientX - dragStart.current.x),
      y: prev.y + (e.clientY - dragStart.current.y)
    }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    setSelectedMapEntity(clickX > canvas.width / 2 ? 'Mhow Sector C' : 'Budhni Sector A');
  };

  return (
    <div className={`flex-1 overflow-y-auto bg-background ${presentationMode ? 'p-0' : ''}`} ref={containerRef}>
      <div className="dashboard-grid">

        {/* ============================================================
            SECTION 1: GOVERNMENT HEADER
            ============================================================ */}
        {!presentationMode && (
          <div className="col-span-12 flex items-end justify-between pb-2 border-b border-outline-variant">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase block leading-none">
                District Collector's Office · Indore Division
              </span>
              <h2 className="text-[20px] font-bold text-on-surface tracking-tight leading-tight mt-1"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                Operational Control Centre
              </h2>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-on-surface-variant shrink-0" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              <span className="bg-green-500/10 text-green-700 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase">{currentRole} VIEW</span>
              <span>SESSION ACTIVE</span>
              <span>{timeStr}</span>
            </div>
          </div>
        )}

        <OperationsToolbar />

        {/* ============================================================
            COLLECTOR VIEW
            Focus: Approvals, High-level alerts, Officer Deployment, Strategy
            ============================================================ */}
        {currentRole === 'Collector' && (
          <>
            <div className="col-span-7">
              <DecisionCentreWidget />
            </div>
            <div className="col-span-5">
              <AlertCenterWidget />
            </div>

            <SectionDivider label="Live Operations" icon="monitoring" />

            <div className="col-span-12">
              <OfficerPanelWidget />
            </div>

            <SectionDivider label="Executive Assessment" icon="health_and_safety" />

            <div className="col-span-5">
              <WidgetCard 
                title="Environmental Health Score" 
                subtitle="Composite Prakriti Index" 
                dataSource="Prakriti Composite Engine"
                confidence={98}
                tooltipText="Aggregated score reflecting overall environmental sustainability and compliance."
              >
                <DistrictScorecard />
              </WidgetCard>
            </div>
            <div className="col-span-7">
              <WidgetCard 
                title="Critical Villages Monitor" 
                subtitle="Locations exceeding environmental thresholds" 
                dataSource="Village Telemetry Network" 
                confidence={95}
                tooltipText="Real-time monitoring of villages categorized as critical or warning state."
                noPadding
              >
                <table className="enterprise-table">
                  <thead>
                    <tr><th>Village</th><th>District</th><th>AQI</th><th>Water Depth</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {mpVillages.slice(0, 4).map(v => (
                      <tr key={v.id}>
                        <td className="font-semibold">{v.name}</td><td>{v.district}</td>
                        <td className="cell-mono">{v.aqiScore}</td><td className="cell-mono">-{v.waterLevelDepth}m</td>
                        <td><span className={severityBadge(v.complianceState)}>{v.complianceState}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </WidgetCard>
            </div>
          </>
        )}

        {/* ============================================================
            OFFICER VIEW
            Focus: Own tasks, local alerts, field GPS
            ============================================================ */}
        {currentRole === 'Officer' && (
          <>
            <div className="col-span-4">
              <WidgetCard 
                title="My Field Status" 
                subtitle="Arjun Sharma · Chief Officer" 
                dataSource="GPS Module"
                confidence={99}
                tooltipText="Current GPS location and daily task progression."
              >
                <div className="flex flex-col items-center justify-center py-6 gap-2 border-b border-outline-variant">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white relative">
                    <span className="material-symbols-outlined text-[32px]">satellite_alt</span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-300 rounded-full animate-ping" />
                  </div>
                  <span className="text-display-sm font-bold text-green-600 tracking-tight">ON-FIELD</span>
                  <span className="text-[12px] text-on-surface-variant font-mono">22.7534° N, 77.7265° E</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                  <div>
                    <span className="text-[24px] font-bold text-on-surface">3</span>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest block">Pending</span>
                  </div>
                  <div>
                    <span className="text-[24px] font-bold text-on-surface">12</span>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest block">Completed</span>
                  </div>
                </div>
              </WidgetCard>
            </div>

            <div className="col-span-8">
              <AlertCenterWidget />
            </div>

            <div className="col-span-12">
              <WidgetCard 
                title="Assigned Routing" 
                subtitle="Optimized path for pending inspections" 
                dataSource="Routing Engine" 
                confidence={92}
                tooltipText="AI-optimized shortest path for pending village inspections."
                noPadding
              >
                <div className="relative w-full cursor-grab active:cursor-grabbing" style={{ height: '350px' }}>
                  <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} className="block w-full h-full" />
                </div>
              </WidgetCard>
            </div>
          </>
        )}

        {/* ============================================================
            ADMINISTRATOR VIEW
            Focus: Audits, System Health, User Management
            ============================================================ */}
        {currentRole === 'Administrator' && (
          <>
            <div className="col-span-12">
              <WidgetCard 
                title="System Health & Telemetry" 
                subtitle="Core infrastructure status" 
                dataSource="DevOps Module"
                confidence={100}
                tooltipText="Real-time uptime metrics for the underlying infrastructure."
              >
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Database Sync', value: '99.9%', status: 'Optimal' },
                    { label: 'GIS Server', value: 'Operational', status: 'Optimal' },
                    { label: 'IoT Sensor Node Network', value: '84/85', status: '1 Node Offline' },
                    { label: 'AI Inference Engine', value: 'Active', status: 'Optimal' },
                  ].map((sys, idx) => (
                    <div key={idx} className="metric-cell">
                      <span className="metric-cell-label">{sys.label}</span>
                      <span className="metric-cell-value text-[16px]">{sys.value}</span>
                      <span className={`metric-cell-trend ${sys.status.includes('Offline') ? 'text-red-500' : 'text-green-500'}`}>{sys.status}</span>
                    </div>
                  ))}
                </div>
              </WidgetCard>
            </div>

            <div className="col-span-7">
              <WidgetCard 
                title="Global Audit Trail" 
                subtitle="Immutable log of all system and user actions" 
                dataSource="Audit Engine"
                confidence={100}
                tooltipText="Cryptographic ledger of all state mutations within the platform."
              >
                <div className="space-y-4">
                  {initialAuditLogs.map((log, idx) => (
                    <div key={log.id} className="relative timeline-track pb-4 last:pb-0">
                      <div className={`timeline-node ${idx === 0 ? 'timeline-node-active' : ''}`} />
                      <div>
                        <span className="text-[12px] font-semibold text-on-surface block">{log.action}</span>
                        <span className="text-[11px] text-on-surface-variant block mt-0.5">{log.details}</span>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[9px] text-on-surface-variant" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{log.timestamp}</span>
                          <span className="text-[9px] text-primary uppercase font-bold">{log.actor}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </WidgetCard>
            </div>

            <div className="col-span-5">
              <WidgetCard 
                title="RBAC Active Sessions" 
                subtitle="Current users in the system" 
                dataSource="Auth Service" 
                confidence={100}
                tooltipText="Live session monitoring for RBAC enforcement."
                noPadding
              >
                <table className="enterprise-table">
                  <thead><tr><th>User</th><th>Role</th><th>Status</th></tr></thead>
                  <tbody>
                    <tr><td className="font-semibold">Collector Node</td><td>Collector</td><td><span className="status-badge status-badge-good">Active</span></td></tr>
                    <tr><td className="font-semibold">A. Sharma</td><td>Officer</td><td><span className="status-badge status-badge-excellent">Field Mobile</span></td></tr>
                    <tr><td className="font-semibold">System Admin 1</td><td>Administrator</td><td><span className="status-badge status-badge-good">Active</span></td></tr>
                  </tbody>
                </table>
              </WidgetCard>
            </div>
          </>
        )}

        {/* ============================================================
            RESEARCH VIEW
            Focus: Analytics, GIS exploration
            ============================================================ */}
        {currentRole === 'Research' && (
          <>
            <div className="col-span-12">
              <WidgetCard 
                title="Interactive Spatial Explorer" 
                subtitle="Full district canvas for deep environmental analysis" 
                dataSource="ISRO Bhuvan" 
                confidence={96}
                tooltipText="Multi-layered interactive GIS interface for geospatial analysis."
                noPadding
              >
                <div className="flex">
                  <div className="w-64 border-r border-outline-variant p-4 space-y-4 bg-surface-container-low shrink-0">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Layers</span>
                    {[
                      { id: 'prakriti', label: 'Prakriti Index' },
                      { id: 'ndvi', label: 'NDVI Vegetation' },
                      { id: 'groundwater', label: 'Aquifers' },
                      { id: 'carbon', label: 'Carbon Storage' },
                      { id: 'forest', label: 'Forest Boundaries' }
                    ].map(layer => (
                      <label key={layer.id} className="flex items-center gap-2.5 cursor-pointer py-1 text-[12px] transition-colors">
                        <input type="radio" name="res_gis_layer" checked={activeGisLayer === layer.id} onChange={() => setActiveGisLayer(layer.id as any)} className="accent-primary" />
                        <span className="font-semibold text-on-surface">{layer.label}</span>
                      </label>
                    ))}
                    <div className="pt-4 border-t border-outline-variant">
                       <button className="w-full px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded font-bold text-[10px] uppercase tracking-wider hover:bg-primary/20 transition-colors">
                        Export Spatial Data
                       </button>
                    </div>
                  </div>
                  <div className="relative w-full cursor-grab active:cursor-grabbing" style={{ height: '500px' }}>
                    <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} className="block w-full h-full" />
                  </div>
                </div>
              </WidgetCard>
            </div>

            <div className="col-span-12">
              <WidgetCard 
                title="Latest Analysis Packages" 
                subtitle="Pre-compiled AI reports available for download" 
                dataSource="Data Warehouse"
                confidence={98}
                tooltipText="Asynchronously generated bulk data packages."
              >
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { title: 'Groundwater Depletion Q3 Report', size: '12.4 MB PDF' },
                    { title: 'Industrial Emissions Audit Log', size: '4.1 MB CSV' },
                    { title: 'Deforestation AI Predictive Model', size: '89 MB JSON' }
                  ].map((doc, idx) => (
                    <div key={idx} className="border border-outline-variant p-3 rounded flex justify-between items-center hover:border-primary transition-colors cursor-pointer">
                       <div>
                         <span className="text-[12px] font-bold text-on-surface block">{doc.title}</span>
                         <span className="text-[10px] text-on-surface-variant font-mono mt-1 block">{doc.size}</span>
                       </div>
                       <span className="material-symbols-outlined text-primary text-[20px]">download</span>
                    </div>
                  ))}
                </div>
              </WidgetCard>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
