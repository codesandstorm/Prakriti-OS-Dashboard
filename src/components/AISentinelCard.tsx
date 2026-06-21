import React from 'react';

interface AISentinelCardProps {
  prediction: string;
  onInitiateProtocol?: () => void;
}

export const AISentinelCard: React.FC<AISentinelCardProps> = ({
  prediction,
  onInitiateProtocol,
}) => {
  return (
    <div className="bg-surface border-l-4 border-l-tertiary-container border border-outline-variant p-4 rounded-lg pointer-events-auto shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-tertiary-container">auto_awesome</span>
        <h3 className="text-label-md font-bold text-tertiary-container uppercase tracking-wider">
          AI Sentinel Insights
        </h3>
      </div>
      <p className="text-body-sm leading-relaxed mb-4 text-on-surface-variant">
        {prediction}
      </p>
      {onInitiateProtocol && (
        <button
          onClick={onInitiateProtocol}
          className="w-full py-2 bg-tertiary text-on-tertiary text-label-md rounded font-bold hover:bg-tertiary-container transition-colors uppercase tracking-wider"
        >
          Initiate Mitigation Protocol
        </button>
      )}
    </div>
  );
};
export default AISentinelCard;
