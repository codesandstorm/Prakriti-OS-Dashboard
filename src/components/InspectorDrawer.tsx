import React from 'react';
import { useStore } from '../hooks/useStore';

export const InspectorDrawer: React.FC = () => {
  const { 
    inspectorType, 
    setDrawerOpen, 
    isDrawerPinned, 
    toggleDrawerPin,
    selectedOfficer,
    selectedIncident,
    selectedVillage,
    selectedScheme,
    selectedGisBoundary,
    addToast
  } = useStore();

  const handleClose = () => {
    setDrawerOpen(false);
  };

  const renderContent = () => {
    switch (inspectorType) {
      case 'officer':
        if (!selectedOfficer) return null;
        return (
          <div className="flex flex-col">
            {/* Header info */}
            <div className="p-gutter flex flex-col items-center border-b border-outline-variant">
              <div className="w-24 h-24 rounded-full border-4 border-surface-container-high overflow-hidden mb-4">
                <img className="w-full h-full object-cover" alt={selectedOfficer.name} src={selectedOfficer.avatarUrl} />
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{selectedOfficer.name}</h3>
              <p className="text-on-surface-variant text-body-md">{selectedOfficer.designation}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => addToast("Secure dialer connected.", "info")} className="px-4 py-1.5 bg-primary text-on-primary rounded font-label-md text-label-md uppercase text-xs font-bold">Contact</button>
                <button onClick={() => addToast("Task assigned successfully.", "success")} className="px-4 py-1.5 border border-outline text-on-surface rounded font-label-md text-label-md uppercase text-xs font-bold">Assign Task</button>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 divide-x divide-outline-variant border-b border-outline-variant">
              <div className="p-4 text-center">
                <div className="text-on-surface-variant font-label-md text-label-md uppercase mb-1 text-[11px]">Experience</div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface">{selectedOfficer.experienceYears || 12} Years</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-on-surface-variant font-label-md text-label-md uppercase mb-1 text-[11px]">Reports Sub.</div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface">{selectedOfficer.reportsSubmitted || 482}</div>
              </div>
            </div>
            {/* Location details */}
            <div className="p-gutter">
              <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2 font-bold">Last Activity</span>
              <p className="text-body-sm text-on-surface font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">location_on</span>
                {selectedOfficer.lastActivityLocation || 'Sector 3 Sector Area'}
              </p>
            </div>
          </div>
        );

      case 'incident':
        if (!selectedIncident) return null;
        return (
          <div className="p-gutter space-y-6">
            <div>
              <span className="px-2 py-0.5 bg-error text-on-error font-label-md text-label-md rounded-sm uppercase font-bold">
                {selectedIncident.severity} Alert
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-2">{selectedIncident.title}</h3>
              <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">{selectedIncident.description}</p>
            </div>
            <div className="space-y-2 border-t border-outline-variant pt-4">
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-variant">Location:</span>
                <span className="font-bold text-on-surface">{selectedIncident.location}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-variant">Coordinates:</span>
                <span className="font-mono-data text-on-surface">{selectedIncident.coordinates}</span>
              </div>
              {selectedIncident.temperature && (
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Telemetry Temp:</span>
                  <span className="font-mono-data text-error font-bold">{selectedIncident.temperature}</span>
                </div>
              )}
              {selectedIncident.threatRadius && (
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Threat Radius:</span>
                  <span className="font-mono-data text-error font-bold">{selectedIncident.threatRadius}</span>
                </div>
              )}
            </div>
            {selectedIncident.teamDeployed && (
              <div className="border-t border-outline-variant pt-4">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">First Responders Deployed</span>
                <div className="p-2 border border-outline-variant rounded bg-surface-container-low flex justify-between items-center text-body-sm font-semibold">
                  <span>{selectedIncident.teamDeployed}</span>
                  <span className="text-primary font-bold">ACTIVE</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'village':
        if (!selectedVillage) return null;
        return (
          <div className="p-gutter space-y-6">
            <div>
              <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                selectedVillage.complianceState === 'CRITICAL' ? 'bg-error-container text-error' :
                selectedVillage.complianceState === 'WARNING' ? 'bg-error-container/30 text-error' : 'bg-primary-container text-primary-fixed'
              }`}>
                {selectedVillage.complianceState} State
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-2">{selectedVillage.name} Village</h3>
              <p className="text-body-sm text-on-surface-variant">Jurisdiction District: {selectedVillage.district}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-4">
              <div className="bg-surface-container-low p-3 rounded border border-outline-variant text-center">
                <span className="text-[10px] text-on-surface-variant block uppercase font-bold">AQI Score</span>
                <span className="text-headline-sm font-bold text-on-surface">{selectedVillage.aqiScore}</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded border border-outline-variant text-center">
                <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Water Depth</span>
                <span className="text-headline-sm font-bold text-secondary">{selectedVillage.waterLevelDepth}m</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded border border-outline-variant text-center col-span-2">
                <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Forest Canopy Cover</span>
                <span className="text-headline-sm font-bold text-primary">{selectedVillage.forestCoverPct}%</span>
              </div>
            </div>
          </div>
        );

      case 'scheme':
        if (!selectedScheme) return null;
        return (
          <div className="p-gutter space-y-6">
            <div>
              <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded-sm uppercase tracking-wide">
                {selectedScheme.sector}
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-2">{selectedScheme.name}</h3>
              <p className="text-body-sm text-on-surface-variant">Allocated Budget: ₹{selectedScheme.budgetAllocatedCr} Cr</p>
            </div>
            <div className="space-y-4 border-t border-outline-variant pt-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-on-surface-variant mb-1">
                  <span>COMPLETION RATE</span>
                  <span>{selectedScheme.completionPct}%</span>
                </div>
                <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${selectedScheme.completionPct}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-body-sm pt-2">
                <span className="text-on-surface-variant">Total Beneficiaries:</span>
                <span className="font-bold text-on-surface">{selectedScheme.beneficiariesCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );

      case 'map':
        if (!selectedGisBoundary) return null;
        return (
          <div className="p-gutter space-y-6">
            <div>
              <span className="px-2 py-0.5 bg-primary-container text-primary-fixed text-[10px] font-bold rounded-sm uppercase tracking-wide">
                GIS Boundary: {selectedGisBoundary.type}
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-2">{selectedGisBoundary.name}</h3>
              {selectedGisBoundary.parentName && (
                <p className="text-body-sm text-on-surface-variant">Parent Sector: {selectedGisBoundary.parentName}</p>
              )}
              {selectedGisBoundary.owner && (
                <p className="text-body-sm text-on-surface-variant">Owner: {selectedGisBoundary.owner}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-4">
              {selectedGisBoundary.areaAcres !== undefined && (
                <div className="bg-surface-container-low p-3 rounded border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant block uppercase font-bold text-xs">Total Area</span>
                  <span className="text-headline-sm font-bold text-on-surface font-mono-data">{selectedGisBoundary.areaAcres.toLocaleString()} ac</span>
                </div>
              )}
              {selectedGisBoundary.ndviScore !== undefined && (
                <div className="bg-surface-container-low p-3 rounded border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant block uppercase font-bold text-xs">NDVI Score</span>
                  <span className="text-headline-sm font-bold text-primary font-mono-data">{selectedGisBoundary.ndviScore}</span>
                </div>
              )}
              {selectedGisBoundary.waterLevelDepth !== undefined && (
                <div className="bg-surface-container-low p-3 rounded border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant block uppercase font-bold text-xs">Water Depth</span>
                  <span className="text-headline-sm font-bold text-secondary font-mono-data">-{selectedGisBoundary.waterLevelDepth}m</span>
                </div>
              )}
              {selectedGisBoundary.carbonStockTn !== undefined && (
                <div className="bg-surface-container-low p-3 rounded border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant block uppercase font-bold text-xs">Carbon Stock</span>
                  <span className="text-headline-sm font-bold text-tertiary font-mono-data">{selectedGisBoundary.carbonStockTn.toLocaleString()} Tn</span>
                </div>
              )}
            </div>

            <div className="border-t border-outline-variant pt-4 space-y-3">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block font-bold text-xs">Boundary Nodes</span>
              <div className="bg-surface-container-low p-2 rounded border border-outline-variant font-mono-data text-xs max-h-32 overflow-y-auto">
                {selectedGisBoundary.coordinates.map((c, i) => (
                  <div key={i} className="flex justify-between py-0.5 border-b border-outline-variant/10">
                    <span>Node {i + 1}:</span>
                    <span>{c.lat.toFixed(4)}°N, {c.lng.toFixed(4)}°E</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full flex items-center justify-center p-gutter text-on-surface-variant italic text-body-sm">
            Select a map boundary, marker, village or officer to inspect metrics.
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-inverse-surface">
      {/* Top Drawer Command Bar */}
      <div className="px-4 py-2 border-b border-outline-variant flex justify-between items-center bg-surface-container-low shrink-0 select-none">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleDrawerPin}
            className={`p-1 rounded hover:bg-surface-container-high transition-colors ${
              isDrawerPinned ? 'text-primary bg-primary-container/20' : 'text-on-surface-variant'
            }`}
            title={isDrawerPinned ? "Unpin side drawer (float mode)" : "Pin side drawer (push layout)"}
          >
            <span className="material-symbols-outlined text-[16px]">keep</span>
          </button>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-mono">
            Inspector Panel
          </span>
        </div>
        <button 
          onClick={handleClose}
          className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};
export default InspectorDrawer;
