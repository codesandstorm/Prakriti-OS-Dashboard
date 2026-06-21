import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { aiModelForecasts, calculateScenarioSimulation } from '../services/aiMockData';

export const Analysis: React.FC = () => {
  const { 
    policyBudgetModifier,
    setPolicyBudgetModifier,
    industrialEnforcement,
    setIndustrialEnforcement,
    reforestationTarget,
    setReforestationTarget
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [activeExplainId, setActiveExplainId] = useState<string | null>(null);

  // Compute live simulation results based on Zustand sliders
  const simulationResults = calculateScenarioSimulation(
    policyBudgetModifier,
    industrialEnforcement,
    reforestationTarget
  );

  const handleRunSimulation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("AI Simulation Engine completed. Scenario workbook metrics re-calculated successfully.");
    }, 600);
  };

  const handleExportReport = () => {
    window.print();
  };

  // Adjust risk pct dynamically based on simulation variables
  const getAdjustedRisk = (category: string, baseRisk: number) => {
    if (category === 'fire') {
      return Math.max(5, Math.round(baseRisk - (reforestationTarget * 0.3) - (industrialEnforcement * 0.2)));
    }
    if (category === 'water') {
      return Math.max(5, Math.round(baseRisk - (policyBudgetModifier * 0.4)));
    }
    if (category === 'flood') {
      return Math.max(5, Math.round(baseRisk - (policyBudgetModifier * 0.1)));
    }
    if (category === 'crop') {
      return Math.max(5, Math.round(baseRisk - (policyBudgetModifier * 0.25) - (reforestationTarget * 0.15)));
    }
    return baseRisk; // carbon
  };

  const filteredForecasts = aiModelForecasts.filter(f => f.confidenceScore >= confidenceThreshold);

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-surface text-on-surface select-none">
      
      {/* Upper AI Command Header */}
      <section className="bg-[#FAF5FF] border-b border-purple-200 px-gutter py-3.5 flex flex-wrap gap-4 items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-purple-700 text-[26px]">psychology</span>
          <div>
            <h2 className="font-headline-sm text-label-lg font-bold text-purple-950 uppercase tracking-wider flex items-center gap-2">
              AI Decision Intelligence Center
            </h2>
            <span className="text-[10px] text-purple-700 font-bold font-mono uppercase tracking-widest">
              Prakriti AI Sentinel Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Confidence Filter */}
          <div className="flex items-center gap-2 bg-white border border-purple-200 rounded px-2.5 py-1 text-xs">
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Conf. Threshold:</span>
            <input 
              type="range" 
              min="80" 
              max="90" 
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
              className="w-20 h-1 accent-purple-600 cursor-pointer"
            />
            <span className="font-bold text-purple-950 font-mono-data">{confidenceThreshold}%+</span>
          </div>

          <button 
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white font-bold text-xs rounded uppercase tracking-wider hover:bg-purple-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            Compile AI Report
          </button>
        </div>
      </section>

      {/* Main scrolling layout */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        
        {/* Row 1: "What-If" Scenario Simulation Policy Board */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Simulation Controls Slider Panel */}
          <div className="col-span-8 bg-white border border-purple-200 p-6 rounded-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
            
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 flex flex-col justify-center items-center gap-2 z-10">
                <span className="material-symbols-outlined animate-spin text-[32px] text-purple-700">loading_timer</span>
                <span className="text-xs text-purple-950 font-mono font-bold">RE-COMPILING CLIMATOLOGICAL OUTCOMES...</span>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-purple-100 mb-4">
                <span className="material-symbols-outlined text-purple-700">tune</span>
                <h3 className="font-bold text-purple-950 text-sm uppercase tracking-wider">
                  "What-If" Policy Simulation Board
                </h3>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-3 gap-6 text-xs">
                
                {/* Budget */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-purple-950">
                    <span>ENVIRONMENTAL BUDGET</span>
                    <span className="font-mono-data text-purple-700">{policyBudgetModifier}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={policyBudgetModifier}
                    onChange={(e) => setPolicyBudgetModifier(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-purple-50 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <p className="text-[10px] text-on-surface-variant leading-tight">
                    Affects water tables filtration and localized reservoir building.
                  </p>
                </div>

                {/* Industrial enforcement */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-purple-950">
                    <span>EMISSION ENFORCEMENT</span>
                    <span className="font-mono-data text-purple-700">{industrialEnforcement}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={industrialEnforcement}
                    onChange={(e) => setIndustrialEnforcement(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-purple-50 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <p className="text-[10px] text-on-surface-variant leading-tight">
                    Regulates factory AQI stack filters and chemical discharge compliance.
                  </p>
                </div>

                {/* Plantation modifier */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-purple-950">
                    <span>AFFORESTATION TARGETS</span>
                    <span className="font-mono-data text-purple-700">{reforestationTarget}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={reforestationTarget}
                    onChange={(e) => setReforestationTarget(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-purple-50 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <p className="text-[10px] text-on-surface-variant leading-tight">
                    Directs biomass canopy preservation and carbon credit markets.
                  </p>
                </div>

              </div>
            </div>

            <div className="mt-5 flex justify-between items-center border-t border-purple-100 pt-4">
              <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">
                COPILOT FOR GOVERNMENT SIMULATOR
              </span>
              <button 
                onClick={handleRunSimulation}
                className="px-5 py-2 bg-purple-700 text-white rounded font-bold text-xs uppercase tracking-wider hover:bg-purple-800 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                Run Policy Simulation
              </button>
            </div>
          </div>

          {/* Simulated Outcomes Card */}
          <div className="col-span-4 bg-purple-950 text-purple-50 p-6 rounded-lg shadow-md flex flex-col justify-between relative overflow-hidden border border-purple-800">
            {/* Ambient Purple glow overlay */}
            <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-purple-700/30 blur-2xl pointer-events-none" />

            <div>
              <div className="flex justify-between items-center pb-2.5 border-b border-purple-800/80 mb-3">
                <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">SIMULATION FORECAST</span>
                <span className="text-[9px] bg-purple-800 text-purple-100 font-bold px-2 py-0.5 rounded font-mono">
                  PREDICTIVE OUTCOMES
                </span>
              </div>

              {/* Outcomes list */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-purple-900/60">
                  <span className="text-purple-300 font-semibold">Simulated Fire Risk:</span>
                  <span className="font-mono-data font-bold text-purple-100">{simulationResults.fireRiskPct}% probability</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-purple-900/60">
                  <span className="text-purple-300 font-semibold">Groundwater Drawdown Risk:</span>
                  <span className="font-mono-data font-bold text-purple-100">{simulationResults.groundwaterRiskPct}% probability</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-purple-900/60">
                  <span className="text-purple-300 font-semibold">Simulated Crop Yield:</span>
                  <span className="font-mono-data font-bold text-purple-100">+{simulationResults.cropYieldPct - 60}% delta</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-purple-900/60">
                  <span className="text-purple-300 font-semibold">Simulated Carbon Capture:</span>
                  <span className="font-mono-data font-bold text-purple-100">{simulationResults.carbonOffsetKt} kT/year</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-800 flex justify-between items-center">
              <span className="text-[10px] text-purple-300 uppercase tracking-wider font-bold">PRAKRITI SCORE DELTA</span>
              <span className={`text-headline-sm font-bold font-mono-data ${simulationResults.prakritiScoreDelta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {simulationResults.prakritiScoreDelta >= 0 ? '+' : ''}{simulationResults.prakritiScoreDelta} pts
              </span>
            </div>
          </div>

        </div>

        {/* Row 2: AI Sentinel Predictions with Explainable AI Drawer dropdowns */}
        <div className="space-y-3">
          <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider font-mono">
            Active Sentinel Climatological Models ({filteredForecasts.length})
          </span>

          <div className="grid grid-cols-1 gap-3">
            {filteredForecasts.map(forecast => {
              const currentRisk = getAdjustedRisk(forecast.category, forecast.baseRiskPct);
              const isHigh = currentRisk >= 60;
              const isMed = currentRisk >= 35;
              const riskColor = isHigh ? 'text-error' : isMed ? 'text-yellow-500' : 'text-primary';
              const riskBg = isHigh ? 'bg-error-container/20' : isMed ? 'bg-yellow-50/50' : 'bg-primary-container/20';

              const isExplained = activeExplainId === forecast.id;

              return (
                <div 
                  key={forecast.id} 
                  className={`bg-white border rounded-lg p-5 transition-all shadow-xs border-purple-200/60 hover:border-purple-500 flex flex-col gap-3 relative`}
                >
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[20px] p-2 rounded-full ${riskBg} ${
                        forecast.category === 'fire' ? 'text-error' : 
                        forecast.category === 'water' ? 'text-secondary' : 'text-purple-700'
                      }`}>
                        {forecast.category === 'fire' ? 'local_fire_department' :
                         forecast.category === 'water' ? 'water_drop' : 'analytics'}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-purple-950 font-sans">{forecast.title}</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {forecast.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs">
                      {/* Risk Pct */}
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-0.5">CURRENT RISK</span>
                        <span className={`font-mono-data font-bold text-sm ${riskColor}`}>
                          {currentRisk}%
                        </span>
                      </div>

                      {/* Confidence */}
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider mb-0.5">CONFIDENCE</span>
                        <span className="font-mono-data font-bold text-purple-700 text-sm">
                          {forecast.confidenceScore}%
                        </span>
                      </div>

                      {/* Explain button */}
                      <button
                        onClick={() => setActiveExplainId(isExplained ? null : forecast.id)}
                        className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 rounded text-xs font-bold uppercase flex items-center gap-1 hover:bg-purple-100"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        {isExplained ? 'Hide Data Sources' : 'Explain AI'}
                      </button>
                    </div>
                  </div>

                  {/* Explainable AI dropdown drawer */}
                  {isExplained && (
                    <div className="mt-3 p-4 bg-[#FAF5FF] border border-purple-200 rounded-lg grid grid-cols-2 gap-6 text-xs text-purple-950 border-t-2 border-t-purple-600 animate-fadeIn">
                      
                      {/* Evidence */}
                      <div className="space-y-2">
                        <span className="font-bold text-[10px] text-purple-800 uppercase tracking-widest block font-bold">
                          Explainable Evidence & Logs
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-on-surface">
                          {forecast.evidence.map((ev, i) => (
                            <li key={i} className="leading-relaxed">{ev}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Data Sources */}
                      <div className="space-y-2 border-l border-purple-200/60 pl-6">
                        <span className="font-bold text-[10px] text-purple-800 uppercase tracking-widest block font-bold">
                          Data Ingestion Registries
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {forecast.dataSources.map((ds, i) => (
                            <span key={i} className="bg-white border border-purple-200 text-purple-950 px-2 py-0.5 rounded font-mono text-[10px]">
                              {ds}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 text-[10px] text-on-surface-variant font-mono">
                          Forecasting Model signature: <span className="font-bold text-purple-700">{forecast.modelId}</span>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* Row 3: AI Recommendations */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Action Recommendations */}
          <div className="col-span-8 bg-white border border-purple-200 p-6 rounded-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-purple-100 mb-4">
                <span className="material-symbols-outlined text-purple-700">recommend</span>
                <h3 className="font-bold text-purple-950 text-sm uppercase tracking-wider">
                  Recommended Climatological Interventions
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-lg space-y-1.5">
                  <span className="font-bold text-purple-900 block text-xs">Water Catchment Audit</span>
                  <p className="text-on-surface-variant leading-relaxed">
                    Trigger groundwater checks across Dhar Block agricultural borders to counter depletion metrics immediately.
                  </p>
                </div>
                <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-lg space-y-1.5">
                  <span className="font-bold text-purple-900 block text-xs">Dry Fog Smog Towers Deployment</span>
                  <p className="text-on-surface-variant leading-relaxed">
                    Allocate ₹1.5 Cr to deploy localized AQI fog towers at Pithampur industrial blocks to filter seasonal particulate counts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Timeline Warnings */}
          <div className="col-span-4 bg-white border border-purple-200 p-6 rounded-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-purple-100 mb-3">
                <span className="material-symbols-outlined text-purple-700">timeline</span>
                <h3 className="font-bold text-purple-950 text-sm uppercase tracking-wider">
                  Predictive AI Sentinel Timeline
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex gap-3 items-start">
                  <span className="w-2 h-2 rounded-full bg-error shrink-0 mt-1" />
                  <div>
                    <span className="font-bold text-purple-950 block">Q3 2026: Dry Canopy Alert</span>
                    <p className="text-on-surface-variant text-[11px]">Forest fire probability peaks due to high local temperatures.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0 mt-1" />
                  <div>
                    <span className="font-bold text-purple-950 block">Q4 2026: Soil pH Degradation</span>
                    <p className="text-on-surface-variant text-[11px]">Sardarpur agricultural sectors show fertilizer trace spikes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Analysis;
