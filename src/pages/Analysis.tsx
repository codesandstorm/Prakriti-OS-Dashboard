import React, { useEffect, useState } from 'react';
import { useStore } from '../hooks/useStore';
import { PowerBiChartCard } from '../components/PowerBiChartCard';
import {
  GroundwaterForecastChart,
  CarbonProgressChart, VegetationGrowthChart,
  EnvironmentalRiskForecastChart
} from '../components/PowerBiCharts';
import { runDeterministicSimulation } from '../services/simulationEngine';

export const Analysis: React.FC = () => {
  const { 
    simulationParams, 
    setSimulationParam, 
    setAllSimulationParams,
    simulationResult,
    setSimulationResult,
    isSimulating,
    setIsSimulating,
    addToast
  } = useStore();

  const [activeScenario, setActiveScenario] = useState<string>('Baseline');

  const runSim = async (params = simulationParams) => {
    setIsSimulating(true);
    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 1200));
    const result = runDeterministicSimulation(params);
    setSimulationResult(result);
    setIsSimulating(false);
    addToast("Simulation complete. Telemetry updated.", "success");
  };

  // Run initial simulation on mount
  useEffect(() => {
    if (!simulationResult) {
      runSim(simulationParams);
    }
  }, []);

  const scenarios = [
    {
      name: "Aggressive Tree Plantation",
      params: { treePlantation: 90, groundwaterExtraction: 50, rainwaterHarvesting: 50, inspectionFrequency: 50, banStubbleBurning: false, promoteDripIrrigation: false, afforestationBudget: 80, officerDeployment: 60, newEnvironmentalScheme: true, carbonCreditParticipation: true }
    },
    {
      name: "Water Conservation Mission",
      params: { treePlantation: 60, groundwaterExtraction: 20, rainwaterHarvesting: 90, inspectionFrequency: 70, banStubbleBurning: false, promoteDripIrrigation: true, afforestationBudget: 50, officerDeployment: 50, newEnvironmentalScheme: true, carbonCreditParticipation: false }
    },
    {
      name: "Industrial Expansion",
      params: { treePlantation: 40, groundwaterExtraction: 80, rainwaterHarvesting: 30, inspectionFrequency: 40, banStubbleBurning: false, promoteDripIrrigation: false, afforestationBudget: 30, officerDeployment: 40, newEnvironmentalScheme: false, carbonCreditParticipation: false }
    },
    {
      name: "Extreme Drought",
      params: { treePlantation: 30, groundwaterExtraction: 90, rainwaterHarvesting: 10, inspectionFrequency: 50, banStubbleBurning: false, promoteDripIrrigation: false, afforestationBudget: 20, officerDeployment: 50, newEnvironmentalScheme: false, carbonCreditParticipation: false }
    }
  ];

  const applyScenario = (name: string, params: any) => {
    setActiveScenario(name);
    setAllSimulationParams(params);
    runSim(params);
  };

  const handleSliderChange = (key: string, val: number) => {
    setActiveScenario('Custom');
    setSimulationParam(key, val);
  };

  const handleToggleChange = (key: string, val: boolean) => {
    setActiveScenario('Custom');
    setSimulationParam(key, val);
  };

  if (!simulationResult) {
    return (
      <div className="flex-grow flex items-center justify-center bg-surface-container-low">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined animate-spin text-[40px] text-primary">sync</span>
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Initializing AI Engine...</p>
        </div>
      </div>
    );
  }

  const { districtScore, executiveSummary, recommendation, riskLevel, indicators, financial, deployment } = simulationResult;

  const getStatusColor = (status: string) => {
    if (status === 'optimal') return 'text-green-500 bg-green-500/10';
    if (status === 'warning') return 'text-amber-500 bg-amber-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-surface-container-low text-on-surface select-none">
      {/* SECTION 1: Executive Briefing */}
      <section className="bg-surface border-b border-outline-variant px-6 py-4 flex flex-col gap-4 shrink-0 shadow-sm z-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-title-lg font-bold text-on-surface tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              Executive Decision Intelligence Workspace
            </h2>
            <div className="flex items-center gap-3 mt-1 text-[11px] font-mono-data text-on-surface-variant uppercase tracking-widest font-bold">
              <span>Last Updated: {new Date().toLocaleTimeString()}</span>
              <span>•</span>
              <span className="text-primary">AI Confidence: {districtScore.confidence}%</span>
              <span>•</span>
              <span className={riskLevel === 'Low' ? 'text-green-500' : riskLevel === 'Moderate' ? 'text-amber-500' : 'text-red-500'}>
                Risk: {riskLevel}
              </span>
            </div>
          </div>
          <button onClick={() => window.print()} className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface font-bold text-xs rounded uppercase tracking-wider hover:bg-surface-container-high transition-all">
            Export Brief
          </button>
        </div>
        <div className="bg-surface-container-low border-l-[3px] border-primary p-3 rounded-r text-sm text-on-surface leading-relaxed">
          <span className="font-bold mr-2">AI Summary:</span>
          {executiveSummary}
        </div>
      </section>

      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 dashboard-grid relative">
        {isSimulating && (
          <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
             <div className="bg-surface p-6 rounded-lg shadow-lg border border-outline-variant flex flex-col items-center gap-4">
               <span className="material-symbols-outlined animate-spin text-[32px] text-primary">sync</span>
               <span className="font-bold text-sm uppercase tracking-widest text-primary">AI is analyzing environmental impact...</span>
             </div>
          </div>
        )}

        {/* SECTION 3: Scenario Library */}
        <div className="col-span-12 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {scenarios.map(s => (
            <button 
              key={s.name}
              onClick={() => applyScenario(s.name, s.params)}
              className={`whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-all ${
                activeScenario === s.name ? 'bg-primary text-on-primary border-primary shadow-md' : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* SECTION 2: Run Simulation (Hero Feature) */}
        <div className="col-span-12 bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-outline-variant">
            <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tune</span> Policy Simulation Engine
            </h3>
            <button 
              onClick={() => runSim()}
              className="px-6 py-2 bg-primary text-on-primary font-bold text-xs rounded uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span> Run Simulation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
            {[
              { label: "Tree Plantation", key: 'treePlantation', type: 'slider' },
              { label: "Groundwater Extraction", key: 'groundwaterExtraction', type: 'slider' },
              { label: "Rainwater Harvesting", key: 'rainwaterHarvesting', type: 'slider' },
              { label: "Inspection Frequency", key: 'inspectionFrequency', type: 'slider' },
              { label: "Afforestation Budget", key: 'afforestationBudget', type: 'slider' },
              { label: "Officer Deployment", key: 'officerDeployment', type: 'slider' },
              { label: "Ban Stubble Burning", key: 'banStubbleBurning', type: 'toggle' },
              { label: "Promote Drip Irrigation", key: 'promoteDripIrrigation', type: 'toggle' },
              { label: "New Environmental Scheme", key: 'newEnvironmentalScheme', type: 'toggle' },
              { label: "Carbon Credit Exchange", key: 'carbonCreditParticipation', type: 'toggle' }
            ].map(param => (
              <div key={param.key} className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  <span>{param.label}</span>
                  {param.type === 'slider' && <span className="text-primary font-mono-data">{(simulationParams as any)[param.key]}%</span>}
                </div>
                {param.type === 'slider' ? (
                  <input 
                    type="range" min="0" max="100" value={(simulationParams as any)[param.key]}
                    onChange={(e) => handleSliderChange(param.key, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-surface-container rounded appearance-none cursor-pointer accent-primary"
                  />
                ) : (
                  <button 
                    onClick={() => handleToggleChange(param.key, !(simulationParams as any)[param.key])}
                    className={`w-full py-1.5 rounded text-[11px] font-bold uppercase transition-colors ${
                      (simulationParams as any)[param.key] ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {(simulationParams as any)[param.key] ? 'Enabled' : 'Disabled'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: AI Decision Recommendation Panel & SECTION 6: Radial Chart */}
        <div className="col-span-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8 bg-surface border border-outline-variant p-5 rounded-lg shadow-sm">
             <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4 border-b border-outline-variant pb-2">AI Recommendation</h3>
             <div className="text-title-md font-bold text-on-surface mb-4 leading-tight">
               {recommendation}
             </div>
             <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Expected Impact</span>
                  <span className={`font-bold text-sm ${districtScore.predicted > districtScore.current ? 'text-green-500' : 'text-red-500'}`}>
                    {districtScore.predicted > districtScore.current ? 'Positive' : 'Negative'} Shift
                  </span>
                </div>
                <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Required Budget</span>
                  <span className="font-bold text-sm font-mono-data">₹{financial.budgetRequired} Cr</span>
                </div>
                <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Timeline</span>
                  <span className="font-bold text-sm">{deployment.expectedCompletion}</span>
                </div>
             </div>
          </div>

          <div className="col-span-12 md:col-span-4 bg-surface border border-outline-variant p-5 rounded-lg shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
             <span className="text-[10px] uppercase font-bold text-on-surface-variant absolute top-4 left-4">District Health Prediction</span>
             <div className="relative w-32 h-32 flex items-center justify-center mt-4">
                {/* Simulated Radial Chart */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="var(--color-surface-container)" strokeWidth="12" fill="none" />
                  <circle cx="64" cy="64" r="56" stroke="var(--color-primary)" strokeWidth="12" fill="none" 
                          strokeDasharray="351.8" strokeDashoffset={351.8 - (351.8 * districtScore.predicted) / 100} 
                          className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-display-sm font-bold font-mono-data leading-none">{districtScore.predicted}</span>
                  <span className={`text-[10px] font-bold ${districtScore.predicted >= districtScore.current ? 'text-green-500' : 'text-red-500'}`}>
                    {districtScore.predicted >= districtScore.current ? '↑' : '↓'} {Math.abs(districtScore.predicted - districtScore.current)} pts
                  </span>
                </div>
             </div>
             <div className="flex gap-4 mt-4 text-[10px] font-mono-data text-on-surface-variant">
               <span>Base: {districtScore.current}</span>
               <span>Target: 80</span>
               <span>State Avg: 62</span>
             </div>
          </div>
        </div>

        {/* SECTION 7: Environmental Indicators Grid */}
        <div className="col-span-12">
          <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4">Environmental Telemetry Matrix</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(indicators).map(([key, ind]: [string, any]) => (
              <div key={key} className="bg-surface border border-outline-variant p-3 rounded flex flex-col gap-2 hover:shadow-sm transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant truncate pr-2">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${getStatusColor(ind.status)}`}>
                    {ind.status}
                  </span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-title-lg font-bold font-mono-data leading-none">{ind.predicted}</span>
                  <span className="text-[10px] text-on-surface-variant font-mono-data pb-0.5">{ind.unit}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] border-t border-outline-variant pt-2 mt-1">
                  <span className="text-on-surface-variant">Base: {ind.current}</span>
                  <span className={`font-bold flex items-center ${ind.trend === 'up' ? 'text-green-500' : ind.trend === 'down' ? 'text-red-500' : 'text-on-surface-variant'}`}>
                    {ind.trend === 'up' ? '↑' : ind.trend === 'down' ? '↓' : '-'} 
                    {Math.abs(ind.predicted - ind.current)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: Interactive Forecasting Charts */}
        <div className="col-span-12">
          <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4 border-b border-outline-variant pb-2">Predictive Telemetry Models</h3>
          <div className="grid grid-cols-12 gap-6">
            <PowerBiChartCard 
              title="Groundwater Drawdown Forecast" 
              subtitle="Historical actuals vs AI predictive trajectory" 
              colSpan={6}
              dataSource="Hydrology Sensors & AI Predictor"
              confidence={88}
              tooltipText="Predictive modeling of groundwater depletion based on current consumption rates."
            >
              <GroundwaterForecastChart />
            </PowerBiChartCard>

            <PowerBiChartCard 
              title="Carbon Sequestration Progress" 
              subtitle="Offset actuals vs target accumulation" 
              colSpan={6}
              dataSource="Carbon Accounting Node"
              confidence={94}
              tooltipText="Tracking real-time carbon offset metrics against the defined municipal target."
            >
              <CarbonProgressChart />
            </PowerBiChartCard>

            <PowerBiChartCard 
              title="Vegetation Growth Trajectory" 
              subtitle="NDVI actual coverage vs mandate" 
              colSpan={6}
              dataSource="Satellite NDVI Service"
              confidence={96}
              tooltipText="Satellite-derived vegetative index comparing current growth to the reforestation mandate."
            >
              <VegetationGrowthChart />
            </PowerBiChartCard>
            
            <PowerBiChartCard 
              title="Environmental Risk Multi-Axis" 
              subtitle="Current systemic vulnerabilities" 
              colSpan={6} minHeight="400px"
              dataSource="Risk Assessment AI"
              confidence={91}
              tooltipText="Radar visualization of key environmental risk factors."
            >
              <EnvironmentalRiskForecastChart />
            </PowerBiChartCard>
          </div>
        </div>

        {/* SECTION 8, 9, 10: Operational Impact Cards */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-outline-variant p-5 rounded-lg shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">account_balance</span> Financial Impact</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                <span className="text-sm">Budget Required</span>
                <span className="font-mono-data font-bold">₹{financial.budgetRequired} Cr</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                <span className="text-sm">Estimated Savings</span>
                <span className="font-mono-data font-bold text-green-500">₹{financial.estimatedSavings} Cr</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                <span className="text-sm">Carbon Revenue</span>
                <span className="font-mono-data font-bold text-primary">₹{financial.carbonRevenue} Cr</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold uppercase">5-Year ROI</span>
                <span className={`font-mono-data font-bold text-lg ${financial.roi > 100 ? 'text-green-500' : 'text-red-500'}`}>{financial.roi}%</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant p-5 rounded-lg shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">badge</span> Officer Deployment</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                <span className="text-sm">Required Field Officers</span>
                <span className="font-mono-data font-bold">{deployment.requiredOfficers}</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                <span className="text-sm">Inspection Load</span>
                <span className="font-mono-data font-bold">{deployment.inspectionLoad}%</span>
              </div>
              <div className="mt-4 pt-2">
                <div className="w-full bg-surface-container rounded-full h-2 mb-1">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(100, deployment.inspectionLoad)}%` }}></div>
                </div>
                <span className="text-[10px] text-on-surface-variant uppercase">Resource Utilization Target</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant p-5 rounded-lg shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">timeline</span> Implementation Timeline</h3>
            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-3 h-3 rounded-full bg-primary border-2 border-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                  <div className="w-[calc(100%-1.5rem)] md:w-[calc(50%-1.5rem)] px-2">
                    <div className="text-[10px] font-bold uppercase text-on-surface-variant">Week 1</div>
                    <div className="text-xs">Policy Directive Issued</div>
                  </div>
               </div>
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-3 h-3 rounded-full bg-outline-variant border-2 border-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                  <div className="w-[calc(100%-1.5rem)] md:w-[calc(50%-1.5rem)] px-2 text-right">
                    <div className="text-[10px] font-bold uppercase text-on-surface-variant">Month 1</div>
                    <div className="text-xs">Deployment & Enforcement</div>
                  </div>
               </div>
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-3 h-3 rounded-full bg-outline-variant border-2 border-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                  <div className="w-[calc(100%-1.5rem)] md:w-[calc(50%-1.5rem)] px-2">
                    <div className="text-[10px] font-bold uppercase text-on-surface-variant">Month 6</div>
                    <div className="text-xs">First Telemetry Shift ({districtScore.predicted > districtScore.current ? 'Positive' : 'Negative'})</div>
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
