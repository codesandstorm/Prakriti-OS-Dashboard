import React from 'react';

interface AiExecutiveInsightProps {
  insightText: string;
  recommendation: string;
  severity?: 'info' | 'warning' | 'critical';
  onAction?: () => void;
  actionText?: string;
}

export const AiExecutiveInsight: React.FC<AiExecutiveInsightProps> = ({
  insightText,
  recommendation,
  severity = 'info',
  onAction,
  actionText = 'Take Action'
}) => {
  const bgColors = {
    info: 'bg-primary-container/20 border-primary/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    critical: 'bg-error-container/20 border-error/30'
  };

  const iconColors = {
    info: 'text-primary',
    warning: 'text-yellow-600',
    critical: 'text-error'
  };

  return (
    <div className={`flex flex-col gap-2 p-4 rounded-lg border ${bgColors[severity]} shadow-sm`}>
      <div className="flex items-center gap-2">
        <span className={`material-symbols-outlined text-[18px] ${iconColors[severity]}`}>auto_awesome</span>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${iconColors[severity]}`}>AI Executive Insight</span>
      </div>
      <p className="text-sm text-on-surface font-medium leading-relaxed">
        {insightText}
      </p>
      <div className="flex items-start justify-between gap-4 mt-2 pt-3 border-t border-outline-variant/40">
        <div className="flex items-start gap-2 text-xs">
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant mt-0.5">recommend</span>
          <span className="text-on-surface-variant leading-relaxed">
            <span className="font-bold text-on-surface">Recommendation:</span> {recommendation}
          </span>
        </div>
        {onAction && (
          <button 
            onClick={onAction}
            className="shrink-0 px-3 py-1.5 bg-surface text-on-surface border border-outline-variant rounded font-bold text-[10px] uppercase tracking-wider hover:bg-surface-container transition-colors"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default AiExecutiveInsight;
