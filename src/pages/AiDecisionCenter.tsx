import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { DecisionCentreWidget } from '../components/OperationalWidgets';
import { KpiCard } from '../components/KpiCard';

export const AiDecisionCenter: React.FC = () => {
  const { currentRole, setProcessing, addToast } = useStore();
  const [chatInput, setChatInput] = useState('');
  
  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-surface-container-low text-on-surface">
      <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
        {/* Page Header */}
        <div className="flex justify-between items-end border-b border-outline-variant pb-4">
          <div>
            <h1 className="text-display-sm font-bold text-on-surface tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[32px]">psychology</span>
              AI Decision Centre
            </h1>
            <p className="text-sm font-mono-data text-on-surface-variant uppercase tracking-widest mt-1">
              Executive Briefing & AI Strategy Generation
            </p>
          </div>
          <div className="flex items-center gap-2">
             <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded text-[10px] font-bold uppercase tracking-wider">
               Role: {currentRole}
             </span>
          </div>
        </div>

        {/* Executive KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard 
            label="Strategic Confidence" 
            value="94%" 
            trend="12k points" trendDirection="up" 
            historicalComparison="Based on 12k data points" 
            dataSource="AI Strategy Engine" 
            statusIndicator="good"
          />
          <KpiCard 
            label="Pending Decisions" 
            value="3" 
            trend="Awaiting" trendDirection="stable" 
            historicalComparison="Awaiting your signature" 
            dataSource="Execution Log" 
            statusIndicator="fair"
          />
          <KpiCard 
            label="Policy Risk Level" 
            value="Low" 
            trend="Mitigated" trendDirection="down" 
            historicalComparison="Mitigated by recent actions" 
            dataSource="Risk Assessor" 
            statusIndicator="good"
          />
        </div>

        {/* Primary Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-6">
            
            {/* AI Executive Summary */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4 border-b border-outline-variant pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
                Executive Briefing
              </h3>
              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r">
                <p className="text-sm leading-relaxed mb-4">
                  <strong>Briefing:</strong> The recent simulation regarding the Water Conservation Mission indicates a 14% improvement in groundwater levels within 6 months. However, the required afforestation budget will exhaust the Q3 allocation.
                </p>
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Recommended Actions:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Approve the Water Conservation Mission immediately to secure contractor rates.</li>
                    <li>Reallocate 15% of the industrial subsidy budget to cover the afforestation shortfall.</li>
                    <li>Delay the Stubble Burning Ban enforcement by 2 weeks to allow for farmer education campaigns.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Conversation / Explain Decision */}
            <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm h-[400px] flex flex-col">
              <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4 border-b border-outline-variant pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">forum</span>
                AI Policy Advisor
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-primary text-[16px]">robot_2</span>
                  </div>
                  <div className="bg-surface-container p-3 rounded-lg rounded-tl-none">
                    <p className="text-sm">I have analyzed the current environmental telemetry. Would you like me to draft the authorization order for the Water Conservation Mission?</p>
                  </div>
                </div>
                <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-surface text-[16px]">person</span>
                  </div>
                  <div className="bg-primary text-on-primary p-3 rounded-lg rounded-tr-none">
                    <p className="text-sm">Yes, draft the order. What is the expected budget impact?</p>
                  </div>
                </div>
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-primary text-[16px]">robot_2</span>
                  </div>
                  <div className="bg-surface-container p-3 rounded-lg rounded-tl-none space-y-2">
                    <p className="text-sm">Drafting order now. The estimated budget requirement is ₹45 Cr.</p>
                    <div className="bg-surface border border-outline-variant p-2 rounded text-xs font-mono-data">
                      <div>Allocated: ₹120 Cr</div>
                      <div>Required: ₹45 Cr</div>
                      <div className="text-green-500">Remaining: ₹75 Cr</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask the AI Advisor to explain a decision or draft a policy..."
                  className="w-full bg-surface-container-low border border-outline-variant rounded-full py-2 pl-4 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button onClick={() => { setProcessing(true, 'AI Consulting Strategic Models...'); setTimeout(() => { setProcessing(false); addToast('Advisor response generated.', 'success'); setChatInput(''); }, 2000); }} className="absolute right-2 top-[22px] w-8 h-8 flex items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
            </div>

          </div>
          
          <div className="md:col-span-4 space-y-6">
             <DecisionCentreWidget />

             {/* Risk Analysis Card */}
             <div className="bg-surface border border-outline-variant rounded-lg p-5 shadow-sm">
                <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4 border-b border-outline-variant pb-2">Implementation Risks</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Budget Overrun</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Medium Risk</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Public Backlash (Stubble Ban)</span>
                    <span className="text-[10px] bg-red-500/10 text-red-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">High Risk</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Resource Bottleneck</span>
                    <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Low Risk</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AiDecisionCenter;
