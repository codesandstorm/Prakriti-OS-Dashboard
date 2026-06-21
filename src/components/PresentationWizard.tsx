import React, { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { useQueryClient } from '@tanstack/react-query';

interface TourStep {
  title: string;
  description: string;
  action: () => void;
}

export const PresentationWizard: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    setCurrentPage,
    setDashboardFilter,
    setDashboardLoading,
    setSelectedVillageId,
    setGisViewMode,
    toggleLayer,
    activeLayers,
    setActiveBaseMap,
    setPolicyBudgetModifier,
    setReforestationTarget,
    setAnalyticsTab,
    isOnline,
    toggleConnection,
    presentationMode,
    setPresentationMode
  } = useStore();

  const [activeTour, setActiveTour] = useState<'collector' | 'officer' | 'ai' | 'gis' | 'environmental' | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const tours: Record<string, TourStep[]> = {
    collector: [
      {
        title: "Collector Cockpit Overview",
        description: "Focusing on the Indore District summary metrics, active telemetry alert systems, and local environment score trends.",
        action: () => {
          setCurrentPage('dashboard');
          setDashboardFilter('district', 'Indore');
          setDashboardFilter('block', 'All Blocks');
          setDashboardLoading(true);
        }
      },
      {
        title: "Analyzing Underperforming Areas",
        description: "Filtering down to specific critical blocks (Mhow Block) to identify localized environmental risks and groundwater tables.",
        action: () => {
          setCurrentPage('dashboard');
          setDashboardFilter('block', 'Mhow Block');
          setDashboardLoading(true);
        }
      },
      {
        title: "Village Health & Intelligence Card",
        description: "Drilling down to Budhni Village environmental passport, reforestation milestones, and AI-predicted risks.",
        action: () => {
          setCurrentPage('villages');
          setSelectedVillageId('VIL-001');
        }
      }
    ],
    officer: [
      {
        title: "Field Force Directory",
        description: "Inspecting district officers, live availability statuses, and real-time performance grades.",
        action: () => {
          setCurrentPage('officers');
        }
      },
      {
        title: "Interactive GPS Topography",
        description: "Checking simulated GPS signals and topography grid coordinates of the target patrol officer.",
        action: () => {
          setCurrentPage('officers');
        }
      },
      {
        title: "Task Dispatch Mutation",
        description: "Opening dispatch panel to programmatically allocate tasks with query-cached updates.",
        action: () => {
          setCurrentPage('officers');
        }
      }
    ],
    ai: [
      {
        title: "Sentinel Predictive Analytics",
        description: "Viewing Forest Fire, groundwater levels, and crop risk forecast confidence rates in the AI cockpit.",
        action: () => {
          setCurrentPage('mission');
        }
      },
      {
        title: "What-If Scenario Simulation",
        description: "Simulating adjustments to conservation funding and reforestation targets to calculate immediate AI carbon outputs.",
        action: () => {
          setCurrentPage('mission');
          setPolicyBudgetModifier(75);
          setReforestationTarget(60);
        }
      }
    ],
    gis: [
      {
        title: "Multi-Layered Map Engine",
        description: "Enabling Hydrology networks and forestry layers on top of base layers.",
        action: () => {
          setCurrentPage('mission');
          setGisViewMode('single');
          setActiveBaseMap('satellite');
          if (!activeLayers.includes('hydrology')) toggleLayer('hydrology');
        }
      },
      {
        title: "Synchronized Dual View",
        description: "Enabling split-screen satellite and terrain comparing village grids side-by-side.",
        action: () => {
          setCurrentPage('mission');
          setGisViewMode('split');
        }
      }
    ],
    environmental: [
      {
        title: "Government Analytics Dashboard",
        description: "Inspecting carbon offset schemes, municipal funds, and pension distributions.",
        action: () => {
          setCurrentPage('analysis');
          setAnalyticsTab('schemes');
        }
      },
      {
        title: "Carbon Offset Incentives Monitor",
        description: "Visualizing state incentive payouts, reforestation targets, and department performances.",
        action: () => {
          setCurrentPage('analysis');
          setAnalyticsTab('incentives');
        }
      }
    ]
  };

  const startTour = (tourKey: 'collector' | 'officer' | 'ai' | 'gis' | 'environmental') => {
    setActiveTour(tourKey);
    setCurrentStepIdx(0);
    tours[tourKey][0].action();
  };

  const nextStep = () => {
    if (!activeTour) return;
    const nextIdx = currentStepIdx + 1;
    if (nextIdx < tours[activeTour].length) {
      setCurrentStepIdx(nextIdx);
      tours[activeTour][nextIdx].action();
    } else {
      setActiveTour(null);
    }
  };

  const prevStep = () => {
    if (!activeTour) return;
    const prevIdx = currentStepIdx - 1;
    if (prevIdx >= 0) {
      setCurrentStepIdx(prevIdx);
      tours[activeTour][prevIdx].action();
    }
  };

  // Keyboard Navigation: Left / Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeTour) return;
      if (e.key === 'ArrowRight') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTour, currentStepIdx]);

  const handleResetDemo = () => {
    localStorage.removeItem('prakriti-command-center-store');
    queryClient.clear();
    window.location.reload();
  };

  const handleExportData = () => {
    alert("Exporting active environment datasets to PDF/CSV format: Export completed successfully.");
  };

  const handlePrint = () => {
    window.print();
  };

  const triggerMockError = () => {
    alert("SYSTEM WARNING: [API Error 503] Environmental Sensor Network temporarily offline. Re-routing telemetry queues...");
  };

  return (
    <div className="fixed bottom-12 left-4 z-[99] select-none text-xs font-medium">
      {/* Mini Toggle Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-on-primary p-3 rounded-full shadow-lg flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 cursor-pointer font-bold uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[18px]">presentation_play</span>
          <span>Open Presentation Console</span>
        </button>
      ) : (
        <div className="bg-white dark:bg-inverse-surface border border-outline-variant rounded-lg shadow-xl w-80 overflow-hidden flex flex-col transition-all">
          {/* Header */}
          <div className="bg-primary text-on-primary px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              <span>Presentation Suite</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-80">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Journeys List */}
          <div className="p-4 space-y-3.5 flex-1 overflow-y-auto max-h-[300px]">
            {!activeTour ? (
              <div className="space-y-2">
                <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold block uppercase tracking-wider">
                  Interactive Guided Journeys
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    onClick={() => startTour('collector')}
                    className="w-full text-left py-1.5 px-2.5 bg-surface-container-low hover:bg-primary/10 rounded flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Collector Executive Tour</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
                  </button>
                  <button
                    onClick={() => startTour('officer')}
                    className="w-full text-left py-1.5 px-2.5 bg-surface-container-low hover:bg-primary/10 rounded flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Officer Workflow Tour</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
                  </button>
                  <button
                    onClick={() => startTour('ai')}
                    className="w-full text-left py-1.5 px-2.5 bg-surface-container-low hover:bg-primary/10 rounded flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>AI Prediction Tour</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
                  </button>
                  <button
                    onClick={() => startTour('gis')}
                    className="w-full text-left py-1.5 px-2.5 bg-surface-container-low hover:bg-primary/10 rounded flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>GIS Topology Tour</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
                  </button>
                  <button
                    onClick={() => startTour('environmental')}
                    className="w-full text-left py-1.5 px-2.5 bg-surface-container-low hover:bg-primary/10 rounded flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Environmental Analytics Tour</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Active Tour Controls */
              <div className="space-y-3 p-1.5 border border-primary/20 bg-primary/5 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                    Tour in progress
                  </span>
                  <button onClick={() => setActiveTour(null)} className="text-on-surface-variant hover:text-error">
                    Exit
                  </button>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-on-surface">
                    Step {currentStepIdx + 1}: {tours[activeTour][currentStepIdx].title}
                  </h4>
                  <p className="text-on-surface-variant dark:text-slate-300 leading-relaxed text-[11px]">
                    {tours[activeTour][currentStepIdx].description}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={prevStep}
                    disabled={currentStepIdx === 0}
                    className="px-2.5 py-1 bg-surface-container border border-outline-variant hover:bg-surface-container-high rounded disabled:opacity-30 cursor-pointer"
                  >
                    Prev
                  </button>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    {currentStepIdx + 1} / {tours[activeTour].length}
                  </span>
                  <button
                    onClick={nextStep}
                    className="px-2.5 py-1 bg-primary text-on-primary hover:opacity-90 rounded cursor-pointer"
                  >
                    {currentStepIdx === tours[activeTour].length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
                <div className="text-[9px] text-on-surface-variant text-center pt-1 font-mono">
                  (Tip: Use Left/Right arrow keys to navigate)
                </div>
              </div>
            )}

            {/* General Settings Bar */}
            <div className="border-t border-outline-variant pt-3.5 space-y-2">
              <span className="text-[10px] text-on-surface-variant dark:text-slate-400 font-bold block uppercase tracking-wider">
                Presentation Controls & Diagnostics
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setPresentationMode(!presentationMode)}
                  className="py-1 px-2 border border-outline-variant hover:bg-surface-container rounded flex items-center justify-center gap-1 cursor-pointer font-bold uppercase text-[10px] tracking-wide"
                >
                  <span className="material-symbols-outlined text-[14px]">fullscreen</span>
                  <span>{presentationMode ? 'Standard UI' : 'Presentation'}</span>
                </button>

                <button
                  onClick={toggleConnection}
                  className="py-1 px-2 border border-outline-variant hover:bg-surface-container rounded flex items-center justify-center gap-1 cursor-pointer font-bold uppercase text-[10px] tracking-wide"
                >
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                  <span>{isOnline ? 'Drop Link' : 'Restore Link'}</span>
                </button>

                <button
                  onClick={handleExportData}
                  className="py-1 px-2 border border-outline-variant hover:bg-surface-container rounded flex items-center justify-center gap-1 cursor-pointer font-bold uppercase text-[10px] tracking-wide"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  <span>Export</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="py-1 px-2 border border-outline-variant hover:bg-surface-container rounded flex items-center justify-center gap-1 cursor-pointer font-bold uppercase text-[10px] tracking-wide"
                >
                  <span className="material-symbols-outlined text-[14px]">print</span>
                  <span>Print</span>
                </button>

                <button
                  onClick={triggerMockError}
                  className="py-1 px-2 bg-error/15 text-error hover:bg-error/25 rounded flex items-center justify-center gap-1 cursor-pointer font-bold uppercase text-[10px] tracking-wide"
                >
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  <span>Trigger Alert</span>
                </button>

                <button
                  onClick={handleResetDemo}
                  className="py-1 px-2 bg-primary-container text-on-primary-fixed-variant hover:opacity-90 rounded flex items-center justify-center gap-1 cursor-pointer font-bold uppercase text-[10px] tracking-wide"
                >
                  <span className="material-symbols-outlined text-[14px]">autorenew</span>
                  <span>Reset Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
