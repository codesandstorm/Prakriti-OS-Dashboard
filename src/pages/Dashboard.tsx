import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../hooks/useStore';
import { AlertStrip } from '../components/AlertStrip';
import { MorningBriefing } from '../components/MorningBriefing';
import { KpiCard } from '../components/KpiCard';
import { mpSchemes } from '../services/mpMockData';
import { initialAuditLogs } from '../services/officerWorkflowMock';
import type { KpiMetric } from '../types';

export const Dashboard: React.FC = () => {
  const { 
    isDashboardLoading
  } = useStore();

  // GIS & Map local states
  const [activeGisLayer, setActiveGisLayer] = useState<'prakriti' | 'ndvi' | 'groundwater' | 'carbon' | 'forest'>('prakriti');
  const [layerOpacity, setLayerOpacity] = useState(0.85);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [timeStep, setTimeStep] = useState<'7d' | '30d' | '90d' | '1y' | 'hist'>('30d');
  const [measureMode, setMeasureMode] = useState<'distance' | 'area' | null>(null);
  const [drawMode, setDrawMode] = useState<'polygon' | 'circle' | null>(null);
  const [drawnPoints, setDrawnPoints] = useState<{x: number, y: number}[]>([]);
  const [selectedMapEntity, setSelectedMapEntity] = useState<string | null>("Mhow Sector C");
  const [showLayerManager, setShowLayerManager] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const kpis: KpiMetric[] = [
    { label: 'Groundwater Table', value: '-12.4m', trend: 'Drop rate: -0.4m avg', trendDirection: 'down' },
    { label: 'Forest Cover', value: '21.7%', trend: '↑ 2.4% over 12 months', trendDirection: 'up' },
    { label: 'Carbon Credits', value: '842 kT', trend: 'Market growth: ↑ 18%', trendDirection: 'up' },
    { label: 'Rainfall Volume', value: '680 mm', trend: '-10% seasonal baseline', trendDirection: 'down' }
  ];

  // Draw the high-fidelity interactive GIS canvas representation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    // Background base satellite / grid representation
    ctx.fillStyle = '#0f1214'; // Dark radar background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Apply pan & zoom
    ctx.translate(canvas.width / 2 + panOffset.x, canvas.height / 2 + panOffset.y);
    ctx.scale(zoomLevel / 12, zoomLevel / 12);

    // Draw topography contour grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let x = -800; x <= 800; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, -600);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }
    for (let y = -600; y <= 600; y += 40) {
      ctx.beginPath();
      ctx.moveTo(-800, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }

    // Draw Indore district boundaries polygon
    ctx.beginPath();
    ctx.moveTo(-150, -100);
    ctx.lineTo(150, -120);
    ctx.lineTo(200, 100);
    ctx.lineTo(-50, 160);
    ctx.lineTo(-180, 80);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(26, 229, 190, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fill area based on active GIS Layer (Chloropleth simulation)
    let fillGrad = ctx.createRadialGradient(0, 0, 50, 0, 0, 250);
    if (activeGisLayer === 'prakriti') {
      // Prakriti Severity palette: excellent / good / fair / poor / critical
      fillGrad.addColorStop(0, `rgba(21, 80, 45, ${layerOpacity})`); // Excellent (Deep Green)
      fillGrad.addColorStop(0.4, `rgba(34, 197, 94, ${layerOpacity})`); // Good
      fillGrad.addColorStop(0.7, `rgba(245, 158, 11, ${layerOpacity})`); // Fair
      fillGrad.addColorStop(0.9, `rgba(234, 88, 12, ${layerOpacity})`); // Poor
      fillGrad.addColorStop(1, `rgba(220, 38, 38, ${layerOpacity})`); // Critical
    } else if (activeGisLayer === 'ndvi') {
      fillGrad.addColorStop(0, `rgba(16, 185, 129, ${layerOpacity})`);
      fillGrad.addColorStop(1, `rgba(6, 78, 59, ${layerOpacity})`);
    } else if (activeGisLayer === 'groundwater') {
      fillGrad.addColorStop(0, `rgba(14, 165, 233, ${layerOpacity})`);
      fillGrad.addColorStop(1, `rgba(3, 105, 161, ${layerOpacity})`);
    } else if (activeGisLayer === 'carbon') {
      fillGrad.addColorStop(0, `rgba(168, 85, 247, ${layerOpacity})`);
      fillGrad.addColorStop(1, `rgba(107, 33, 168, ${layerOpacity})`);
    } else {
      fillGrad.addColorStop(0, `rgba(52, 211, 153, ${layerOpacity})`);
      fillGrad.addColorStop(1, `rgba(4, 120, 87, ${layerOpacity})`);
    }
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Draw hydrology rivers network representation
    ctx.beginPath();
    ctx.moveTo(-120, -90);
    ctx.bezierCurveTo(-20, -50, 40, 20, 120, 140);
    ctx.strokeStyle = '#2563eb'; // Blue water
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw selected block target highlight
    if (selectedMapEntity) {
      ctx.beginPath();
      ctx.arc(40, -20, 45, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label highlight
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(selectedMapEntity.toUpperCase(), 45, -25);
    }

    // Draw live field force officer coordinate markers
    ctx.fillStyle = '#1ae5be'; // Active marker
    ctx.beginPath();
    ctx.arc(-80, 40, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px monospace';
    ctx.fillText("OFFICER ARJUN", -120, 30);

    // Draw active drawing points (Polygon / Circle)
    if (drawnPoints.length > 0) {
      ctx.beginPath();
      ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
      drawnPoints.forEach(pt => ctx.lineTo(pt.x, pt.y));
      if (drawMode === 'polygon') ctx.closePath();
      ctx.strokeStyle = '#f59e0b'; // Amber draw
      ctx.lineWidth = 1.5;
      ctx.stroke();

      drawnPoints.forEach(pt => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();

    // Draw scale bar in bottom-left corner
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, canvas.height - 30, 80, 2);
    ctx.fillRect(20, canvas.height - 35, 1, 7);
    ctx.fillRect(100, canvas.height - 35, 1, 7);
    ctx.font = '8px monospace';
    ctx.fillText("SCALE: 5 KM", 20, canvas.height - 18);

  }, [activeGisLayer, layerOpacity, zoomLevel, panOffset, selectedMapEntity, drawnPoints, drawMode]);

  // Canvas interaction mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = false;
    
    // If not dragging, handle click selection inside map coordinate bounds
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (drawMode) {
      // Map click coordinates relative to centered translation
      const mapPt = {
        x: clickX - canvas.width / 2 - panOffset.x,
        y: clickY - canvas.height / 2 - panOffset.y
      };
      setDrawnPoints(prev => [...prev, mapPt]);
    } else {
      // Toggle simulated selected entities
      if (clickX > canvas.width / 2) {
        setSelectedMapEntity("Mhow Sector C");
      } else {
        setSelectedMapEntity("Budhni Sector A");
      }
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => direction === 'in' ? Math.min(prev + 1, 20) : Math.max(prev - 1, 4));
  };

  const handleHomeExtent = () => {
    setZoomLevel(12);
    setPanOffset({ x: 0, y: 0 });
    setSelectedMapEntity("Mhow Sector C");
    setDrawnPoints([]);
  };

  const clearDrawnObjects = () => {
    setDrawnPoints([]);
    setMeasureMode(null);
    setDrawMode(null);
  };

  return (
    <div className="flex-grow flex h-full overflow-hidden bg-background text-on-surface">
      
      {/* LEFT COLUMN: GIS Primary Workspace (60% width) */}
      <section className="w-3/5 h-full flex flex-col border-r border-outline-variant bg-[#0f1214] relative select-none">
        
        {/* Floating Interactive Toolbar */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-inverse-surface/95 border border-outline-variant rounded shadow-md flex items-center p-1 gap-1">
          <button 
            onClick={() => handleZoom('in')}
            className="p-1.5 hover:bg-surface-container rounded text-on-surface transition-colors"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[16px]">zoom_in</span>
          </button>
          <button 
            onClick={() => handleZoom('out')}
            className="p-1.5 hover:bg-surface-container rounded text-on-surface transition-colors"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[16px]">zoom_out</span>
          </button>
          <button 
            onClick={handleHomeExtent}
            className="p-1.5 hover:bg-surface-container rounded text-on-surface transition-colors"
            title="Home Extent"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
          </button>
          
          <div className="h-5 w-px bg-outline-variant mx-1" />

          <button 
            onClick={() => { setMeasureMode('distance'); setDrawMode('polygon'); }}
            className={`p-1.5 rounded transition-colors ${measureMode === 'distance' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface'}`}
            title="Measure Distance"
          >
            <span className="material-symbols-outlined text-[16px]">straighten</span>
          </button>
          <button 
            onClick={() => { setDrawMode('polygon'); setMeasureMode('area'); }}
            className={`p-1.5 rounded transition-colors ${drawMode === 'polygon' && measureMode === 'area' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface'}`}
            title="Measure Area"
          >
            <span className="material-symbols-outlined text-[16px]">square_foot</span>
          </button>
          <button 
            onClick={clearDrawnObjects}
            className="p-1.5 hover:bg-surface-container rounded text-on-surface transition-colors"
            title="Clear Measurements"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>

        {/* Floating Layer Manager Toggle */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
          <button
            onClick={() => setShowLayerManager(!showLayerManager)}
            className="bg-white/95 border border-outline-variant p-2 rounded shadow-md flex items-center gap-1.5 font-bold hover:bg-surface-container transition-colors text-on-surface text-[10px]"
          >
            <span className="material-symbols-outlined text-[16px]">layers</span>
            <span>LAYERS PANEL</span>
          </button>

          {showLayerManager && (
            <div className="bg-white dark:bg-inverse-surface border border-outline-variant rounded-lg shadow-lg w-64 p-4 text-[10px] space-y-4">
              <span className="font-bold text-on-surface uppercase tracking-wider block border-b border-outline-variant/50 pb-1">
                ArcGIS Layer Manager
              </span>

              {/* Layer Selection */}
              <div className="space-y-1.5">
                {[
                  { id: 'prakriti', label: 'Prakriti Health Score Map' },
                  { id: 'ndvi', label: 'NDVI Canopy Vegetation' },
                  { id: 'groundwater', label: 'Groundwater Aquifers Depth' },
                  { id: 'carbon', label: 'Carbon Storage Index' },
                  { id: 'forest', label: 'State Protected Forests' }
                ].map(layer => (
                  <label key={layer.id} className="flex items-center gap-2 cursor-pointer py-1 px-1.5 rounded hover:bg-surface-container-low">
                    <input 
                      type="radio" 
                      name="gis_layer"
                      checked={activeGisLayer === layer.id}
                      onChange={() => setActiveGisLayer(layer.id as any)}
                      className="accent-primary"
                    />
                    <span className="text-on-surface font-semibold">{layer.label}</span>
                  </label>
                ))}
              </div>

              {/* Opacity Control */}
              <div className="space-y-1 pt-2 border-t border-outline-variant/40">
                <div className="flex justify-between text-on-surface-variant font-bold">
                  <span>Layer Opacity</span>
                  <span>{Math.round(layerOpacity * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.05"
                  value={layerOpacity}
                  onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
                  className="w-full accent-primary h-1 bg-surface-container rounded-lg appearance-none"
                />
              </div>

              {/* Persistent Legend */}
              <div className="space-y-1.5 pt-2 border-t border-outline-variant/40">
                <span className="font-bold text-on-surface-variant uppercase tracking-wider block">Severity Legend</span>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-700 rounded-sm" />
                  <span>Excellent Conditions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-sm" />
                  <span>Good Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded-sm" />
                  <span>Fair Indicator</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-sm" />
                  <span>Poor Severity</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-600 rounded-sm" />
                  <span>Critical Risk (Sentinel Triggered)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Canvas Render Panel */}
        <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden">
          <canvas 
            ref={canvasRef} 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="block"
          />
        </div>

        {/* Temporal Time Slider Dashboard Controls */}
        <div className="bg-[#111615] border-t border-outline-variant p-4 flex items-center justify-between gap-4 text-[10px] select-none text-white shrink-0">
          <span className="font-bold uppercase tracking-wider block shrink-0">Temporal Timeline</span>
          <div className="flex-1 flex gap-2 justify-between">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: '1y', label: '1 Year' },
              { id: 'hist', label: 'Historical' }
            ].map(step => (
              <button
                key={step.id}
                onClick={() => setTimeStep(step.id as any)}
                className={`flex-1 py-1.5 font-bold uppercase rounded border transition-colors cursor-pointer text-center ${
                  timeStep === step.id 
                    ? 'bg-primary text-on-primary border-primary' 
                    : 'border-outline-variant/40 hover:bg-surface-container text-slate-300'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>

      </section>

      {/* RIGHT COLUMN: Executive Intelligence Panel (40% width) */}
      <section className="w-2/5 h-full flex flex-col overflow-y-auto p-6 bg-surface-bright space-y-6 shrink-0">
        
        {/* Section 1: Government Header */}
        <div className="border-b border-outline-variant pb-3 flex justify-between items-end">
          <div>
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest block leading-none">Indore Division HQ</span>
            <h2 className="text-headline-md font-bold text-on-surface tracking-tight mt-1">Spatial Decision Intelligence</h2>
          </div>
          <span className="text-[10px] text-on-surface-variant font-mono">SECURE LINK</span>
        </div>

        {/* Section 2: Morning Briefing */}
        <MorningBriefing />

        {/* Section 3: Critical Alerts Strip */}
        <div className="space-y-2">
          <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">
            Critical Alerts Queue
          </span>
          <AlertStrip />
        </div>

        {/* Section 4: Selected GIS Entity Inspector */}
        <div className="bg-white border border-outline-variant rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant pb-2">
            <div>
              <span className="text-[9px] text-on-surface-variant font-bold block uppercase">Active Map Entity Selection</span>
              <h3 className="font-bold text-headline-sm text-primary mt-0.5">
                {selectedMapEntity || "No Selection"}
              </h3>
            </div>
            {selectedMapEntity && (
              <span className="px-2 py-0.5 bg-error-container/30 text-error rounded font-bold text-[9px] font-mono">
                RISK HIGH
              </span>
            )}
          </div>

          {selectedMapEntity ? (
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-2.5 rounded border border-outline-variant/60">
                  <span className="text-[10px] text-on-surface-variant block font-semibold uppercase">Prakriti Score</span>
                  <span className="text-headline-sm font-bold text-primary font-mono-data">58.4 / 100</span>
                </div>
                <div className="bg-surface-container-low p-2.5 rounded border border-outline-variant/60">
                  <span className="text-[10px] text-on-surface-variant block font-semibold uppercase">State Ranking</span>
                  <span className="text-headline-sm font-bold text-on-surface font-mono-data">Rank #12</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                <div className="flex justify-between">
                  <span className="font-bold text-on-surface-variant">Groundwater Table depth:</span>
                  <span className="font-bold font-mono text-secondary">-18.2 meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-on-surface-variant">Forestry Canopy density:</span>
                  <span className="font-bold font-mono text-primary">12.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-on-surface-variant">Carbon stock calculation:</span>
                  <span className="font-bold font-mono text-on-surface">322 kT CO2e</span>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-3 rounded mt-2">
                <div className="flex items-center gap-1.5 text-primary font-bold uppercase text-[9px] tracking-wider mb-1">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  <span>AI Recommended Action</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  Dispatch water monitoring officer to verify aquifer levels. Initiate soil re-nitrogenation schedules.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-on-surface-variant italic">
              Click on the Indore district map boundaries to inspect local environmental details.
            </div>
          )}
        </div>

        {/* Section 5: Executive KPI Grid */}
        <div className="space-y-3">
          <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">
            Operational Overview KPIs
          </span>
          <div className="grid grid-cols-2 gap-4">
            {kpis.map((kpi, idx) => (
              <KpiCard
                key={idx}
                label={kpi.label}
                value={kpi.value}
                trend={kpi.trend}
                trendDirection={kpi.trendDirection}
                isLoading={isDashboardLoading}
              />
            ))}
          </div>
        </div>

        {/* Section 6: Government Schemes & Budgets */}
        <div className="bg-white border border-outline-variant rounded-lg p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              Environmental Conservation Schemes
            </span>
          </div>

          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant uppercase font-bold">
                <th className="py-2 px-2.5">Scheme</th>
                <th className="py-2 px-2.5">Budget</th>
                <th className="py-2 px-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 font-medium text-on-surface">
              {mpSchemes.slice(0, 3).map((s, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-2.5 font-bold truncate max-w-[120px]">{s.name}</td>
                  <td className="py-2 px-2.5 font-mono">₹{s.budgetAllocatedCr} Cr</td>
                  <td className="py-2 px-2.5 text-right text-primary font-bold">ACTIVE</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 7: Audit Activity Log */}
        <div className="bg-white border border-outline-variant rounded-lg p-5 space-y-4">
          <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">
            Chronological Audit Activity Log
          </span>
          <div className="relative border-l-2 border-outline-variant/60 ml-3 pl-5 space-y-4 text-xs">
            {initialAuditLogs.slice(0, 3).map((log, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[27px] top-0 w-3 h-3 rounded-full border border-outline bg-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                </span>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-on-surface block">{log.action}</span>
                    <span className="text-on-surface-variant text-[11px] mt-0.5 block">{log.details}</span>
                  </div>
                  <span className="font-mono text-on-surface-variant">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 8: Footer Intelligence */}
        <div className="border-t border-outline-variant/60 pt-4 flex justify-between items-center text-[10px] text-on-surface-variant font-mono">
          <span>GOVT INTEL STAMP APPROVED</span>
          <span>REFRESH: 15S</span>
        </div>

      </section>
    </div>
  );
};

export default Dashboard;
