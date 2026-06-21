import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { MapContainer } from '../modules/gis/MapContainer';
import { mpGisBoundaries, mockTimelineData } from '../services/gisMockData';
import { mpOfficers } from '../services/mpMockData';

export const MissionControl: React.FC = () => {
  const { 
    activeLayers,
    toggleLayer,
    zoomIn,
    zoomOut,
    coordinates,
    selectedIncident,
    gisViewMode,
    setGisViewMode,
    activeBaseMap,
    setActiveBaseMap,
    splitBaseMap,
    setSplitBaseMap,
    timelineYear,
    setTimelineYear,
    selectedGisBoundary: _selectedGisBoundary, // keep or just prefix with underscore
    setSelectedGisBoundary,
    isIntelOpen: _isIntelOpen,
    setIntelOpen: _setIntelOpen
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q) {
      setSearchResults([]);
      return;
    }

    const matches = [
      ...mpGisBoundaries.filter(b => b.name.toLowerCase().includes(q.toLowerCase()) || b.id.toLowerCase().includes(q.toLowerCase())),
      ...mpOfficers.filter(o => o.name.toLowerCase().includes(q.toLowerCase()))
    ];
    setSearchResults(matches.slice(0, 5));
  };

  const handleSelectResult = (item: any) => {
    setSearchQuery('');
    setSearchResults([]);
    if (item.type) { // It's a GIS boundary
      setSelectedGisBoundary(item);
    } else { // It's an officer
      useStore.getState().setSelectedOfficer(item);
    }
  };

  const baseMaps = [
    { id: 'satellite', label: 'Satellite Layer' },
    { id: 'terrain', label: 'Terrain Relief' },
    { id: 'road', label: 'Minimalist Vector' },
    { id: 'hybrid', label: 'Hybrid Cartography' }
  ] as const;

  const environmentalLayers = [
    { id: 'ndvi', label: 'NDVI Vegetation Index', color: 'bg-green-600' },
    { id: 'groundwater', label: 'Groundwater Table Depth', color: 'bg-sky-400' },
    { id: 'carbon', label: 'Carbon Stock Density', color: 'bg-purple-500' },
    { id: 'waterbodies', label: 'Hydrology / Water Bodies', color: 'bg-blue-600' },
    { id: 'forests', label: 'State Protected Forests', color: 'bg-emerald-600' }
  ] as const;

  return (
    <div className="flex-grow flex h-full overflow-hidden bg-surface text-on-surface select-none">
      
      {/* Side Control Dock (Left Column 320px) */}
      <section className="w-80 h-full border-r border-outline-variant bg-surface-bright flex flex-col justify-between shrink-0">
        
        {/* Layer Selector Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-headline-sm text-label-lg font-bold text-on-background uppercase tracking-wider">
                GIS Control Panel
              </h2>
              <span className="text-[10px] bg-primary-container text-on-primary-container font-bold font-mono px-2 py-0.5 rounded">
                ArcGIS
              </span>
            </div>
            
            {/* Unified GIS Search Bar */}
            <div className="relative mt-3">
              <div className="flex items-center gap-1 bg-surface-container border border-outline-variant rounded px-2 py-1 text-xs">
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">search</span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search Village, Parcel, Officer..."
                  className="bg-transparent focus:outline-none flex-1 text-on-surface"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-outline-variant rounded shadow-lg z-50 text-xs flex flex-col divide-y divide-outline-variant max-h-48 overflow-y-auto">
                  {searchResults.map((res, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSelectResult(res)}
                      className="px-3 py-2 text-left hover:bg-surface-container-high flex justify-between items-center"
                    >
                      <span className="font-semibold text-on-surface">{res.name}</span>
                      <span className="text-[9px] bg-surface-variant text-on-surface-variant font-mono px-1 rounded uppercase">
                        {res.type || 'Officer'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Base Map Options */}
          <div className="border-t border-outline-variant/60 pt-4">
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-2">
              Base Map Layout
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {baseMaps.map((bm) => (
                <button
                  key={bm.id}
                  onClick={() => setActiveBaseMap(bm.id)}
                  className={`p-2 border rounded font-semibold transition-all ${
                    activeBaseMap === bm.id 
                      ? 'border-primary bg-primary/5 text-primary font-bold' 
                      : 'border-outline-variant hover:bg-surface-container'
                  }`}
                >
                  {bm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Environmental Layers */}
          <div className="border-t border-outline-variant/60 pt-4">
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-2">
              Environmental Layers
            </span>
            <div className="flex flex-col gap-2.5">
              {environmentalLayers.map((layer) => (
                <label 
                  key={layer.id} 
                  className="flex items-center gap-3 cursor-pointer text-xs group select-none"
                >
                  <input 
                    type="checkbox"
                    checked={activeLayers.includes(layer.id)}
                    onChange={() => toggleLayer(layer.id)}
                    className="rounded text-primary focus:ring-primary w-4 h-4 border-outline-variant"
                  />
                  <span className="text-on-surface group-hover:text-primary transition-colors">
                    {layer.label}
                  </span>
                  <div className={`ml-auto w-2.5 h-2.5 rounded-full ${layer.color}`} />
                </label>
              ))}
            </div>
          </div>

          {/* Dynamic GIS Legend */}
          <div className="border-t border-outline-variant/60 pt-4">
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-2">
              Spatial Legend
            </span>
            <div className="bg-surface-container-low border border-outline-variant rounded p-3 text-[11px] space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-on-surface-variant">District Boundary:</span>
                <span className="w-10 h-0.5 bg-orange-500 block" />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-on-surface-variant">Block Border:</span>
                <span className="w-10 h-0.5 border-t border-dashed border-yellow-500 block" />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-on-surface-variant">Village Bounds:</span>
                <span className="w-10 h-0.5 bg-purple-500 block" />
              </div>
              {activeLayers.includes('ndvi') && (
                <div className="pt-1.5 border-t border-outline-variant/30">
                  <span className="font-semibold text-on-surface-variant block mb-1">NDVI Veg Scale:</span>
                  <div className="w-full h-2 bg-gradient-to-r from-green-100 to-green-800 rounded-sm" />
                  <div className="flex justify-between text-[9px] text-on-surface-variant mt-0.5">
                    <span>Bare Soil (0.1)</span>
                    <span>High Canopy (0.9)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Viewport Compare & Split controls */}
        <div className="p-4 border-t border-outline-variant bg-surface flex flex-col gap-2 select-none">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
            Viewport Screen Mode
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setGisViewMode('single')}
              className={`p-2 border rounded font-semibold transition-all flex items-center justify-center gap-1.5 ${
                gisViewMode === 'single'
                  ? 'border-primary bg-primary/5 text-primary font-bold'
                  : 'border-outline-variant hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">fullscreen</span> Single Screen
            </button>
            <button
              onClick={() => setGisViewMode('split')}
              className={`p-2 border rounded font-semibold transition-all flex items-center justify-center gap-1.5 ${
                gisViewMode === 'split'
                  ? 'border-primary bg-primary/5 text-primary font-bold'
                  : 'border-outline-variant hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">splitscreen</span> Split Compare
            </button>
          </div>
        </div>
      </section>

      {/* Main Map Viewer Area */}
      <section className="flex-grow h-full relative flex flex-col">
        
        {/* Upper Layer: Map Render Area */}
        <div className="flex-1 relative flex">
          {gisViewMode === 'split' ? (
            <div className="w-full h-full flex divide-x divide-outline-variant">
              <div className="w-1/2 h-full relative">
                <MapContainer />
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded shadow-sm z-10 select-none">
                  VIEWPORT 1 (PRIMARY)
                </div>
              </div>
              <div className="w-1/2 h-full relative">
                {/* Secondary compare map with custom base preference */}
                <MapContainer split />
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded shadow-sm z-10 select-none">
                  VIEWPORT 2 (SECONDARY CONTRAST)
                </div>
                {/* Secondary Base Map Selection Overlay */}
                <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-xs border border-outline-variant p-2.5 rounded-lg z-10 flex gap-2 items-center text-xs shadow-sm select-none">
                  <span className="font-semibold text-on-surface">Base:</span>
                  <select 
                    value={splitBaseMap}
                    onChange={(e) => setSplitBaseMap(e.target.value as any)}
                    className="bg-surface border border-outline-variant rounded px-2.5 py-1 text-xs cursor-pointer text-on-surface"
                  >
                    <option value="satellite">Satellite</option>
                    <option value="terrain">Terrain</option>
                    <option value="road">Vector Road</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <MapContainer />
            </div>
          )}

          {/* Floating Zoom overlay controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 z-10 select-none">
            <div className="bg-surface/90 backdrop-blur-sm border border-outline-variant p-2.5 rounded-lg flex flex-col gap-1 shadow-sm">
              <button 
                onClick={zoomIn} 
                className="p-2 hover:bg-surface-container-high rounded text-on-surface transition-colors flex items-center justify-center"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
              <div className="h-px bg-outline-variant w-full my-1"></div>
              <button 
                onClick={zoomOut} 
                className="p-2 hover:bg-surface-container-high rounded text-on-surface transition-colors flex items-center justify-center"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lower Layer: Timeline Slider (Historical Playback) */}
        <div className="bg-surface px-6 py-4 border-t border-outline-variant flex gap-6 items-center select-none shrink-0 z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
            <span className="font-bold text-xs uppercase tracking-wider text-on-surface-variant font-mono">
              Temporal Index
            </span>
          </div>

          {/* Slider input */}
          <div className="flex-1 flex items-center gap-4">
            <input 
              type="range" 
              min="2021" 
              max="2026" 
              value={timelineYear} 
              onChange={(e) => setTimelineYear(parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between w-full max-w-lg text-[10px] text-on-surface-variant font-mono">
              {mockTimelineData.map((d) => (
                <button
                  key={d.year}
                  onClick={() => setTimelineYear(d.year)}
                  className={`flex flex-col items-center gap-0.5 transition-all ${
                    timelineYear === d.year ? 'text-primary font-bold scale-110' : 'hover:text-on-surface'
                  }`}
                >
                  <span className="text-xs">{d.year}</span>
                  <span>Cov: {d.forestCoverPct}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Coordinates & Threat Toolbar */}
        <div className="bg-surface/95 backdrop-blur-md border-t border-outline-variant p-4 z-10 flex justify-between items-center select-none shrink-0">
          <div className="flex gap-8 text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-0.5">Coordinates</span>
              <span className="font-mono text-body-sm text-on-surface font-semibold">
                {coordinates}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-0.5">Temp / Humidity</span>
              <span className="font-mono text-body-sm text-on-surface font-semibold">
                {selectedIncident ? '34°C / 62%' : '28°C / 78%'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-0.5">Wind Velocity</span>
              <span className="font-mono text-body-sm text-on-surface font-semibold">
                {selectedIncident?.windVelocity || '14.2 km/h SSE'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-0.5">Threat Radius</span>
              <span className="font-mono text-body-sm text-error font-bold font-semibold">
                {selectedIncident?.threatRadius || '12.5 km'}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => alert("Emergency alert broadcast sent to dispatch registers.")} 
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[16px]">broadcast_on_personal</span> Broadcast Alert
            </button>
            <button 
              onClick={() => alert("District state emergency protocol active.")} 
              className="flex items-center gap-2 px-4 py-2 bg-error text-on-error font-bold text-xs rounded uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[16px]">emergency_share</span> Emergency Protocol
            </button>
          </div>
        </div>

      </section>
    </div>
  );
};

export default MissionControl;
