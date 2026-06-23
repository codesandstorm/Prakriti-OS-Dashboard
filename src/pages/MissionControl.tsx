import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { MapContainer } from '../modules/gis/MapContainer';
import { mpGisBoundaries, mpGisSensors, mockTimelineData } from '../services/gisMockData';
import type { GisBoundary } from '../services/gisMockData';
import { mpOfficers, mpSchemes, mpVillages } from '../services/mpMockData';

/* ============================================================
   PRAKRITI GIS INTELLIGENCE — SPATIAL COMMAND WORKSPACE
   Architecture: ArcGIS Enterprise Operations Dashboard
   Layout: Layer Sidebar (260px) | Map Canvas (~68%) | Inspector (320px)
   ============================================================ */

// -----------------------------------------------------------
// Severity utility
// -----------------------------------------------------------
const severityClass = (level: string) => {
  const map: Record<string, string> = {
    'OPTIMAL': 'status-badge status-badge-good',
    'WARNING': 'status-badge status-badge-fair',
    'CRITICAL': 'status-badge status-badge-critical',
    'optimal': 'status-badge status-badge-good',
    'warning': 'status-badge status-badge-fair',
    'critical': 'status-badge status-badge-critical',
    'Healthy': 'status-badge status-badge-good',
    'Degraded': 'status-badge status-badge-fair',
    'Critical': 'status-badge status-badge-critical',
    'ON-FIELD': 'status-badge status-badge-excellent',
    'ACTIVE': 'status-badge status-badge-good',
    'INACTIVE': 'status-badge status-badge-neutral',
  };
  return map[level] || 'status-badge status-badge-neutral';
};

// -----------------------------------------------------------
// AQI severity label
// -----------------------------------------------------------
const aqiLabel = (score: number | undefined) => {
  if (!score) return { text: 'N/A', cls: 'status-badge status-badge-neutral' };
  if (score <= 50) return { text: 'Good', cls: 'status-badge status-badge-excellent' };
  if (score <= 100) return { text: 'Satisfactory', cls: 'status-badge status-badge-good' };
  if (score <= 200) return { text: 'Moderate', cls: 'status-badge status-badge-fair' };
  if (score <= 300) return { text: 'Poor', cls: 'status-badge status-badge-poor' };
  return { text: 'Hazardous', cls: 'status-badge status-badge-critical' };
};

const LiveTelemetryFeed = () => {
  const { coordinates } = useStore();
  const [telemetry, setTelemetry] = useState({ p_score: 92.4, carbon_ppm: 410, gw_depth: -22.4, packet_loss: 0.01 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        p_score: prev.p_score + (Math.random() * 0.2 - 0.1),
        carbon_ppm: prev.carbon_ppm + (Math.random() * 2 - 1),
        gw_depth: prev.gw_depth + (Math.random() * 0.1 - 0.05),
        packet_loss: Math.random() * 0.05
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-8 items-center text-on-surface font-mono-data">
      <div className="flex flex-col">
        <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest font-sans">Sys Status</span>
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> <span className="font-bold text-green-500">NOMINAL</span></div>
      </div>
      <div className="flex flex-col w-20">
        <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest font-sans">P-Score (Avg)</span>
        <span>{telemetry.p_score.toFixed(2)}</span>
      </div>
      <div className="flex flex-col w-20">
        <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest font-sans">Carbon (PPM)</span>
        <span>{telemetry.carbon_ppm.toFixed(1)}</span>
      </div>
      <div className="flex flex-col w-20">
        <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest font-sans">GW Depth</span>
        <span className={telemetry.gw_depth < -25 ? 'text-red-500' : ''}>{telemetry.gw_depth.toFixed(2)}m</span>
      </div>
      <div className="flex flex-col w-20">
        <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest font-sans">Coords</span>
        <span className="text-[10px]">{coordinates}</span>
      </div>
    </div>
  );
};

export const MissionControl: React.FC = () => {
  const {
    activeLayers,
    toggleLayer,
    zoomIn,
    zoomOut,
    coordinates,
    selectedGisBoundary,
    setSelectedGisBoundary,
    activeBaseMap,
    setActiveBaseMap,
    timelineYear,
    setTimelineYear,
    measurementTool,
    setMeasurementTool,
    drawingMode,
    setDrawingMode,
  } = useStore();

  const [layerSidebarOpen, setLayerSidebarOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectorTab, setInspectorTab] = useState<'profile' | 'environment' | 'officers' | 'schemes' | 'risk'>('profile');

  // -----------------------------------------------------------
  // Breadcrumb Trail (District → Block → Village → Parcel)
  // -----------------------------------------------------------
  const breadcrumbTrail = useMemo(() => {
    const trail: { label: string; boundary: GisBoundary | null }[] = [
      { label: 'All Districts', boundary: null }
    ];
    if (!selectedGisBoundary) return trail;

    // Walk up the parent chain
    const chain: GisBoundary[] = [];
    let current: GisBoundary | undefined = selectedGisBoundary;
    while (current) {
      chain.unshift(current);
      current = current.parentName
        ? mpGisBoundaries.find(b => b.name === current!.parentName)
        : undefined;
    }
    chain.forEach(b => trail.push({ label: b.name, boundary: b }));
    return trail;
  }, [selectedGisBoundary]);

  // -----------------------------------------------------------
  // Cross-filtered data based on selected boundary
  // -----------------------------------------------------------
  const crossFilteredVillage = useMemo(() => {
    if (!selectedGisBoundary) return null;
    const name = selectedGisBoundary.name;
    return mpVillages.find(v => v.name === name) || null;
  }, [selectedGisBoundary]);

  const crossFilteredOfficers = useMemo(() => {
    if (!selectedGisBoundary) return mpOfficers;
    // Filter officers by district matching boundary or parent
    const districtName = selectedGisBoundary.type === 'district'
      ? selectedGisBoundary.name
      : selectedGisBoundary.parentName || '';
    return mpOfficers.filter(o => o.district === districtName || districtName === '');
  }, [selectedGisBoundary]);

  const crossFilteredSchemes = useMemo(() => {
    return mpSchemes; // All schemes shown, but could filter by sector/district
  }, []);

  // -----------------------------------------------------------
  // Search handler
  // -----------------------------------------------------------
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return mpGisBoundaries
      .filter(b => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q))
      .slice(0, 6);
  }, [searchQuery]);

  const handleSelectSearchResult = useCallback((boundary: GisBoundary) => {
    setSelectedGisBoundary(boundary);
    setSearchQuery('');
    setInspectorOpen(true);
  }, [setSelectedGisBoundary]);

  // -----------------------------------------------------------
  // Layer definitions
  // -----------------------------------------------------------
  const environmentalLayers = [
    { id: 'prakriti', label: 'Prakriti Score', icon: 'eco' },
    { id: 'groundwater', label: 'Groundwater', icon: 'water_drop' },
    { id: 'ndvi', label: 'Vegetation (NDVI)', icon: 'forest' },
    { id: 'carbon', label: 'Carbon Storage', icon: 'compost' },
    { id: 'waterbodies', label: 'Water Bodies', icon: 'waves' },
    { id: 'forests', label: 'Protected Forests', icon: 'park' },
    { id: 'burning', label: 'Burning Events', icon: 'local_fire_department' },
    { id: 'officers', label: 'Officer Activity', icon: 'badge' },
    { id: 'inspection', label: 'Inspection Zones', icon: 'verified' },
  ];

  const baseMaps = [
    { id: 'satellite', label: 'Satellite', icon: 'satellite_alt' },
    { id: 'terrain', label: 'Terrain', icon: 'terrain' },
    { id: 'road', label: 'Vector', icon: 'map' },
    { id: 'hybrid', label: 'Hybrid', icon: 'layers' },
  ] as const;

  // Selected boundary metrics
  const sel = selectedGisBoundary;

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-[#0c0f11] text-on-surface select-none">

      {/* ============================================================
          LEFT: LAYER SIDEBAR (collapsible, 260px)
          ============================================================ */}
      <aside
        className="h-full flex flex-col border-r border-outline-variant bg-surface shrink-0 transition-all duration-200 overflow-hidden"
        style={{ width: layerSidebarOpen ? '260px' : '44px' }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-outline-variant bg-surface-container-low shrink-0">
          {layerSidebarOpen && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Layers</span>
          )}
          <button
            onClick={() => setLayerSidebarOpen(!layerSidebarOpen)}
            className="widget-action-btn"
            title={layerSidebarOpen ? 'Collapse' : 'Expand'}
          >
            <span className="material-symbols-outlined text-[16px]">
              {layerSidebarOpen ? 'chevron_left' : 'chevron_right'}
            </span>
          </button>
        </div>

        {layerSidebarOpen && (
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Search */}
            <div className="relative">
              <div className="flex items-center gap-1.5 bg-surface-container border border-outline-variant rounded px-2.5 py-1.5 text-[11px]">
                <span className="material-symbols-outlined text-on-surface-variant text-[14px]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search boundaries..."
                  className="bg-transparent focus:outline-none flex-1 text-on-surface text-[11px]"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-surface border border-outline-variant rounded shadow-lg z-50 text-[11px] max-h-48 overflow-y-auto">
                  {searchResults.map(res => (
                    <button
                      key={res.id}
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full px-3 py-2 text-left hover:bg-surface-container-low flex justify-between items-center border-b border-outline-variant last:border-b-0 transition-colors"
                    >
                      <span className="font-semibold text-on-surface">{res.name}</span>
                      <span className="text-[9px] text-on-surface-variant uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                        {res.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Base Map */}
            <div>
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Base Map</span>
              <div className="grid grid-cols-2 gap-1.5">
                {baseMaps.map(bm => (
                  <button
                    key={bm.id}
                    onClick={() => setActiveBaseMap(bm.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[10px] font-semibold transition-colors ${
                      activeBaseMap === bm.id
                        ? 'border-on-surface bg-surface-container-high text-on-surface'
                        : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">{bm.icon}</span>
                    {bm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Environmental Layers */}
            <div>
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Environmental Layers</span>
              <div className="space-y-0.5">
                {environmentalLayers.map(layer => (
                  <label
                    key={layer.id}
                    className="flex items-center gap-2.5 cursor-pointer py-1.5 px-2 rounded hover:bg-surface-container-low text-[11px] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={activeLayers.includes(layer.id)}
                      onChange={() => toggleLayer(layer.id)}
                      className="accent-[var(--color-on-surface)] w-3.5 h-3.5"
                    />
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant">{layer.icon}</span>
                    <span className="text-on-surface font-medium">{layer.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Boundary Layers */}
            <div>
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Administrative Boundaries</span>
              <div className="space-y-2 text-[10px]">
                {[
                  { label: 'District Boundaries', style: 'bg-on-surface-variant', dash: false },
                  { label: 'Block Boundaries', style: 'border-t border-dashed border-on-surface-variant', dash: true },
                  { label: 'Village Boundaries', style: 'bg-outline', dash: false },
                  { label: 'Parcel Drill-down', style: 'bg-outline-variant', dash: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-2">
                    <span className="text-on-surface-variant font-medium">{item.label}</span>
                    {item.dash ? (
                      <span className="w-8 h-0 border-t border-dashed border-on-surface-variant" />
                    ) : (
                      <span className={`w-8 h-0.5 rounded ${item.style}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Persistent Legend */}
            <div>
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Severity Legend</span>
              <div className="space-y-1.5 text-[10px]">
                {[
                  { label: 'Excellent', cls: 'status-badge-excellent' },
                  { label: 'Good', cls: 'status-badge-good' },
                  { label: 'Fair', cls: 'status-badge-fair' },
                  { label: 'Poor', cls: 'status-badge-poor' },
                  { label: 'Critical', cls: 'status-badge-critical' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 px-2">
                    <span className={`status-badge ${item.cls}`} style={{ padding: '1px 6px', fontSize: '9px' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensor Status */}
            <div>
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Active Sensors</span>
              <div className="space-y-1">
                {mpGisSensors.map(sensor => (
                  <div key={sensor.id} className="flex items-center justify-between px-2 py-1 text-[10px]">
                    <span className="text-on-surface font-medium truncate max-w-[140px]">{sensor.name}</span>
                    <span className={severityClass(sensor.status)} style={{ padding: '1px 6px', fontSize: '9px' }}>
                      {sensor.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collapsed icons */}
        {!layerSidebarOpen && (
          <div className="flex-1 flex flex-col items-center py-3 gap-2">
            <button onClick={() => setLayerSidebarOpen(true)} className="widget-action-btn" title="Layers">
              <span className="material-symbols-outlined text-[18px]">layers</span>
            </button>
            <button onClick={() => setLayerSidebarOpen(true)} className="widget-action-btn" title="Search">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>
            <button onClick={() => setLayerSidebarOpen(true)} className="widget-action-btn" title="Legend">
              <span className="material-symbols-outlined text-[18px]">legend_toggle</span>
            </button>
          </div>
        )}
      </aside>

      {/* ============================================================
          CENTER: MAP CANVAS (fills remaining ~68%)
          ============================================================ */}
      <section className="flex-1 h-full flex flex-col relative min-w-0">

        {/* Breadcrumb Navigation */}
        <div className="bg-surface border-b border-outline-variant px-4 py-1.5 flex items-center gap-1 text-[11px] shrink-0 z-10">
          {breadcrumbTrail.map((crumb, idx) => {
            const isLast = idx === breadcrumbTrail.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="material-symbols-outlined text-[12px] text-on-surface-variant">chevron_right</span>}
                <button
                  onClick={() => {
                    if (crumb.boundary) setSelectedGisBoundary(crumb.boundary);
                    else setSelectedGisBoundary(null);
                  }}
                  className={`transition-colors font-medium ${
                    isLast ? 'text-on-surface font-bold pointer-events-none' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  disabled={isLast}
                >
                  {crumb.label}
                </button>
              </React.Fragment>
            );
          })}
          <span className="ml-auto text-[9px] text-on-surface-variant" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            {coordinates}
          </span>
        </div>

        {/* Map Canvas Area */}
        <div className="flex-1 relative">
          <MapContainer />

          {/* Floating Interactive Toolbar */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            <div className="bg-black/60 backdrop-blur-sm rounded p-0.5 flex flex-col gap-0.5">
              {[
                { icon: 'add', action: zoomIn, title: 'Zoom In' },
                { icon: 'remove', action: zoomOut, title: 'Zoom Out' },
                { icon: 'home', action: () => { /* reset extent */ }, title: 'Home Extent' },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title={btn.title}
                >
                  <span className="material-symbols-outlined text-[18px]">{btn.icon}</span>
                </button>
              ))}
            </div>

            {/* Measurement Tools */}
            <div className="bg-black/60 backdrop-blur-sm rounded p-0.5 flex flex-col gap-0.5">
              <button
                onClick={() => setMeasurementTool(measurementTool === 'distance' ? null : 'distance')}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                  measurementTool === 'distance' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title="Measure Distance"
              >
                <span className="material-symbols-outlined text-[18px]">straighten</span>
              </button>
              <button
                onClick={() => setDrawingMode(drawingMode === 'polygon' ? null : 'polygon')}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                  drawingMode === 'polygon' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title="Draw Area"
              >
                <span className="material-symbols-outlined text-[18px]">draw</span>
              </button>
              <button
                onClick={() => { setMeasurementTool(null); setDrawingMode(null); }}
                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Clear Tools"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>

          {/* Inspector Toggle (if closed) */}
          {!inspectorOpen && (
            <button
              onClick={() => setInspectorOpen(true)}
              className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm rounded p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Open Inspector"
            >
              <span className="material-symbols-outlined text-[18px]">info</span>
            </button>
          )}
        </div>

        {/* Bottom Status Bar + Timeline */}
        <div className="bg-surface border-t border-outline-variant px-4 py-2 flex items-center gap-6 shrink-0 z-10">
          {/* Telemetry Readout */}
          <div className="flex gap-6 text-[10px] items-center">
            <LiveTelemetryFeed />
          </div>

          {/* Timeline Slider */}
          <div className="flex-1 flex items-center gap-3 ml-4">
            <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest shrink-0">Timeline</span>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="range"
                min="2021" max="2026"
                value={timelineYear}
                onChange={(e) => setTimelineYear(parseInt(e.target.value))}
                className="flex-1 h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-[var(--color-on-surface)]"
              />
              <div className="flex gap-2">
                {mockTimelineData.map(d => (
                  <button
                    key={d.year}
                    onClick={() => setTimelineYear(d.year)}
                    className={`text-[9px] font-semibold transition-colors ${
                      timelineYear === d.year ? 'text-on-surface font-bold' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {d.year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          RIGHT: INSPECTOR PANEL (320px, cross-filtered)
          ============================================================ */}
      {inspectorOpen && (
        <aside className="w-80 h-full border-l border-outline-variant bg-surface flex flex-col shrink-0 overflow-hidden">
          {/* Inspector Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-outline-variant bg-surface-container-low shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Inspector</span>
            <button onClick={() => setInspectorOpen(false)} className="widget-action-btn" title="Close">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          {/* Selection Summary */}
          <div className="px-4 py-3 border-b border-outline-variant shrink-0">
            {sel ? (
              <div>
                <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block">
                  {sel.type} Selection
                </span>
                <h3 className="text-[15px] font-bold text-on-surface mt-0.5 leading-tight">{sel.name}</h3>
                {sel.parentName && (
                  <span className="text-[10px] text-on-surface-variant">Parent: {sel.parentName}</span>
                )}
                {sel.owner && (
                  <span className="text-[10px] text-on-surface-variant block">Owner: {sel.owner}</span>
                )}
              </div>
            ) : (
              <div className="text-[11px] text-on-surface-variant italic">
                Click a boundary on the map to inspect.
              </div>
            )}
          </div>

          {/* Inspector Tabs */}
          {sel && (
            <>
              <div className="flex border-b border-outline-variant shrink-0">
                {([
                  { id: 'profile', label: 'Profile', icon: 'info' },
                  { id: 'environment', label: 'Env', icon: 'eco' },
                  { id: 'officers', label: 'Officers', icon: 'badge' },
                  { id: 'schemes', label: 'Schemes', icon: 'account_balance' },
                  { id: 'risk', label: 'Risk', icon: 'warning' },
                ] as const).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setInspectorTab(tab.id)}
                    className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[9px] font-bold uppercase tracking-wider transition-colors border-b-2 ${
                      inspectorTab === tab.id
                        ? 'text-on-surface border-on-surface'
                        : 'text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* PROFILE TAB */}
                {inspectorTab === 'profile' && (
                  <>
                    {/* Key metrics grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {sel.areaAcres !== undefined && (
                        <div className="metric-cell">
                          <span className="metric-cell-label">Area</span>
                          <span className="metric-cell-value text-[15px]">{sel.areaAcres.toLocaleString()}</span>
                          <span className="metric-cell-trend">acres</span>
                        </div>
                      )}
                      {sel.aqiScore !== undefined && (
                        <div className="metric-cell">
                          <span className="metric-cell-label">AQI Score</span>
                          <span className="metric-cell-value text-[15px]">{sel.aqiScore}</span>
                          <span className={aqiLabel(sel.aqiScore).cls} style={{ padding: '1px 6px', fontSize: '9px', marginTop: '2px' }}>
                            {aqiLabel(sel.aqiScore).text}
                          </span>
                        </div>
                      )}
                      {sel.ndviScore !== undefined && (
                        <div className="metric-cell">
                          <span className="metric-cell-label">NDVI Score</span>
                          <span className="metric-cell-value text-[15px]">{sel.ndviScore}</span>
                          <span className="metric-cell-trend">Vegetation Index</span>
                        </div>
                      )}
                      {sel.waterLevelDepth !== undefined && (
                        <div className="metric-cell">
                          <span className="metric-cell-label">Water Depth</span>
                          <span className="metric-cell-value text-[15px]">-{sel.waterLevelDepth}m</span>
                          <span className="metric-cell-trend">Below surface</span>
                        </div>
                      )}
                      {sel.carbonStockTn !== undefined && (
                        <div className="metric-cell">
                          <span className="metric-cell-label">Carbon Stock</span>
                          <span className="metric-cell-value text-[15px]">{sel.carbonStockTn.toLocaleString()}</span>
                          <span className="metric-cell-trend">tonnes CO2e</span>
                        </div>
                      )}
                    </div>

                    {/* Coordinates */}
                    <div>
                      <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Boundary Nodes</span>
                      <div className="bg-surface-container-low border border-outline-variant rounded p-2 text-[10px] max-h-24 overflow-y-auto" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                        {sel.coordinates.map((c, i) => (
                          <div key={i} className="flex justify-between py-0.5 border-b border-outline-variant/20 last:border-b-0">
                            <span className="text-on-surface-variant">Node {i + 1}</span>
                            <span className="text-on-surface">{c.lat.toFixed(4)}°N, {c.lng.toFixed(4)}°E</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cross-filtered Village Profile */}
                    {crossFilteredVillage && (
                      <div>
                        <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Village Profile</span>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="flex justify-between border-b border-outline-variant pb-1">
                            <span className="text-on-surface-variant">Population</span>
                            <span className="font-semibold text-on-surface" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{crossFilteredVillage.population.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-b border-outline-variant pb-1">
                            <span className="text-on-surface-variant">Forest Cover</span>
                            <span className="font-semibold text-on-surface" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{crossFilteredVillage.forestCoverPct}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-on-surface-variant">Compliance</span>
                            <span className={severityClass(crossFilteredVillage.complianceState)} style={{ padding: '1px 6px', fontSize: '9px' }}>
                              {crossFilteredVillage.complianceState}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Recommendation */}
                    <div className="bg-surface-container-low border border-outline-variant rounded p-3">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
                        <span className="material-symbols-outlined text-[12px]">psychology</span>
                        AI Recommendation
                      </div>
                      <p className="text-[11px] text-on-surface leading-relaxed">
                        {sel.aqiScore && sel.aqiScore > 150
                          ? `Deploy air quality monitoring team to ${sel.name}. AQI exceeds safe threshold. Recommend industrial emission audit within 48 hours.`
                          : sel.waterLevelDepth && sel.waterLevelDepth > 20
                          ? `Initiate groundwater recharge programme for ${sel.name}. Water table critically low at -${sel.waterLevelDepth}m. Schedule hydrological survey.`
                          : `${sel.name} environmental indicators within acceptable range. Continue routine monitoring. Next inspection scheduled in 14 days.`
                        }
                      </p>
                    </div>
                  </>
                )}

                {/* ENVIRONMENT TAB */}
                {inspectorTab === 'environment' && (
                  <>
                    <div>
                      <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Environmental History</span>
                      <div className="space-y-2">
                        {mockTimelineData.map(d => (
                          <div key={d.year} className={`flex items-center justify-between text-[11px] py-1.5 px-2 rounded border transition-colors ${
                            timelineYear === d.year ? 'border-on-surface bg-surface-container-low' : 'border-outline-variant'
                          }`}>
                            <span className="font-bold text-on-surface" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{d.year}</span>
                            <div className="flex gap-3 text-[10px] text-on-surface-variant">
                              <span>Forest: {d.forestCoverPct}%</span>
                              <span>GW: -{d.groundwaterAvgDepth}m</span>
                              <span>Fires: {d.activeFires}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Inspections */}
                    <div>
                      <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Recent Inspections</span>
                      <div className="space-y-2">
                        {[
                          { date: '2026-06-18', type: 'Forest Canopy Audit', officer: 'Arjun K. Sharma', result: 'Logged' },
                          { date: '2026-06-12', type: 'Water Table Check', officer: 'Vikram Singh', result: 'Optimal' },
                          { date: '2026-06-05', type: 'AQI Calibration', officer: 'Priya Deshmukh', result: 'Calibrated' },
                        ].map((insp, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] py-1.5 border-b border-outline-variant last:border-b-0">
                            <div>
                              <span className="font-semibold text-on-surface block">{insp.type}</span>
                              <span className="text-[10px] text-on-surface-variant">{insp.officer} · {insp.date}</span>
                            </div>
                            <span className="text-[9px] text-on-surface-variant font-semibold uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                              {insp.result}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* OFFICERS TAB */}
                {inspectorTab === 'officers' && (
                  <>
                    <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block mb-2">
                      Deployed Officers {sel.parentName ? `(${sel.parentName})` : `(${sel.name})`}
                    </span>
                    <div className="space-y-2">
                      {crossFilteredOfficers.map(officer => (
                        <div key={officer.id} className="flex items-center gap-3 py-2 border-b border-outline-variant last:border-b-0">
                          <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden shrink-0">
                            <img src={officer.avatarUrl} alt={officer.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-semibold text-on-surface block truncate">{officer.name}</span>
                            <span className="text-[10px] text-on-surface-variant">{officer.designation}</span>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <span className={severityClass(officer.status)} style={{ padding: '1px 6px', fontSize: '9px' }}>
                              {officer.status}
                            </span>
                            <span className="text-[9px] text-on-surface-variant mt-0.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                              {officer.perfScore}/100
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* SCHEMES TAB */}
                {inspectorTab === 'schemes' && (
                  <>
                    <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Government Schemes</span>
                    <div className="space-y-3">
                      {crossFilteredSchemes.map(scheme => (
                        <div key={scheme.id} className="border border-outline-variant rounded p-3 space-y-2">
                          <div>
                            <span className="text-[11px] font-semibold text-on-surface block">{scheme.name}</span>
                            <span className="text-[10px] text-on-surface-variant">{scheme.sector} · ₹{scheme.budgetAllocatedCr} Cr</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${scheme.completionPct}%`, background: 'var(--color-on-surface-variant)' }} />
                            </div>
                            <span className="text-[10px] font-bold text-on-surface" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                              {scheme.completionPct}%
                            </span>
                          </div>
                          <span className="text-[10px] text-on-surface-variant">{scheme.beneficiariesCount.toLocaleString()} beneficiaries</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* RISK TAB */}
                {inspectorTab === 'risk' && (
                  <>
                    <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest block mb-2">Risk Indicators</span>
                    <div className="space-y-3">
                      {[
                        {
                          label: 'Air Quality Risk',
                          value: sel.aqiScore || 0,
                          threshold: 200,
                          unit: 'AQI',
                          detail: sel.aqiScore && sel.aqiScore > 200 ? 'Exceeds safe limit. Industrial audit required.' : 'Within acceptable range.'
                        },
                        {
                          label: 'Groundwater Depletion',
                          value: sel.waterLevelDepth || 0,
                          threshold: 25,
                          unit: 'meters',
                          detail: sel.waterLevelDepth && sel.waterLevelDepth > 25 ? 'Critical depletion. Recharge programme needed.' : 'Sustainable extraction rate.'
                        },
                        {
                          label: 'Deforestation Risk',
                          value: sel.ndviScore ? Math.round((1 - sel.ndviScore) * 100) : 0,
                          threshold: 60,
                          unit: '% bare',
                          detail: sel.ndviScore && sel.ndviScore < 0.4 ? 'High deforestation risk. Immediate action needed.' : 'Vegetation cover adequate.'
                        },
                      ].map((risk, i) => {
                        const isRisky = risk.value > risk.threshold;
                        return (
                          <div key={i} className="border border-outline-variant rounded p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-on-surface">{risk.label}</span>
                              <span className={isRisky ? 'status-badge status-badge-critical' : 'status-badge status-badge-good'} style={{ padding: '1px 6px', fontSize: '9px' }}>
                                {isRisky ? 'HIGH' : 'LOW'}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-[16px] font-bold text-on-surface" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                                {risk.value}
                              </span>
                              <span className="text-[10px] text-on-surface-variant">{risk.unit}</span>
                              <span className="text-[10px] text-on-surface-variant ml-auto">threshold: {risk.threshold}</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min((risk.value / (risk.threshold * 1.5)) * 100, 100)}%`,
                                  background: isRisky ? '#dc2626' : 'var(--color-on-surface-variant)'
                                }}
                              />
                            </div>
                            <p className="text-[10px] text-on-surface-variant leading-relaxed">{risk.detail}</p>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* No Selection State */}
          {!sel && (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-on-surface-variant p-6 text-center">
              <span className="material-symbols-outlined text-[32px]">touch_app</span>
              <span className="text-[12px] font-semibold">Select a boundary</span>
              <p className="text-[11px] leading-relaxed">
                Click any district, block, village, or parcel on the map to view its environmental profile, officer deployment, and risk assessment.
              </p>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};

export default MissionControl;
