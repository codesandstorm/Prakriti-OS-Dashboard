import React from 'react';
import type { Incident } from '../types';

interface AlertCardProps {
  incident: Incident;
  onDeploy?: (incident: Incident) => void;
  onSelect?: (incident: Incident) => void;
  compact?: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  incident,
  onDeploy,
  onSelect,
  compact = false,
}) => {
  const isCritical = incident.severity === 'CRITICAL';
  const isWarning = incident.severity === 'WARNING';
  const isResponded = incident.severity === 'RESPONDED';

  let borderClass = 'border-outline-variant';
  let severityBadgeClass = 'bg-surface-container-highest text-on-surface-variant';
  let iconName = 'fmd_bad';
  let iconColorClass = 'text-on-surface-variant';

  if (isCritical) {
    borderClass = 'border-error border-l-4';
    severityBadgeClass = 'bg-error text-on-error';
    iconName = 'dangerous';
    iconColorClass = 'text-error';
  } else if (isWarning) {
    borderClass = 'border-[#F59E0B] border-l-4';
    severityBadgeClass = 'bg-[#F59E0B] text-white';
    iconName = 'warning';
    iconColorClass = 'text-[#F59E0B]';
  } else if (isResponded) {
    borderClass = 'border-secondary border-l-4';
    severityBadgeClass = 'bg-secondary text-on-secondary';
    iconName = 'engineering';
    iconColorClass = 'text-secondary';
  }

  if (compact) {
    return (
      <div 
        onClick={() => onSelect?.(incident)}
        className={`p-3 rounded bg-surface-container-lowest border ${borderClass} flex gap-3 transition-all hover:bg-white cursor-pointer`}
      >
        <span className={`material-symbols-outlined ${iconColorClass} text-xl`}>
          {iconName}
        </span>
        <div className="flex flex-col">
          <span className={`text-label-md font-bold ${iconColorClass}`}>
            {incident.title.toUpperCase()}
          </span>
          <span className="text-body-sm text-on-surface-variant leading-tight">
            {incident.description}
          </span>
          <span className="text-[10px] mt-1 opacity-60 font-mono-data">
            {incident.time}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface-container-lowest border rounded p-4 flex flex-col gap-3 transition-all hover:bg-white ${borderClass}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 font-label-md text-label-md rounded-sm uppercase ${severityBadgeClass}`}>
            {incident.severity}
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant font-mono-data">
            M-ID: {incident.code}
          </span>
        </div>
        <span className="text-on-surface-variant text-body-sm font-mono-data">
          {incident.time}
        </span>
      </div>

      <div>
        <h3 className={`font-headline-sm text-headline-sm font-bold mb-1 ${isCritical ? 'text-error' : 'text-on-surface'}`}>
          {incident.title}
        </h3>
        <p className="text-on-surface-variant text-body-sm leading-relaxed">
          {incident.description}
        </p>
      </div>

      <div className="flex items-center gap-4 text-body-sm text-on-surface-variant border-t border-outline-variant/30 pt-2">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          {incident.location}
        </div>
        {incident.temperature && (
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">device_thermostat</span>
            {incident.temperature}
          </div>
        )}
        {incident.flowRate && incident.flowRate !== 'N/A' && (
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">waves</span>
            {incident.flowRate}
          </div>
        )}
      </div>

      <div className="pt-2 flex justify-end gap-2 border-t border-outline-variant/30">
        {onDeploy && incident.severity !== 'RESOLVED' && (
          <button
            onClick={() => onDeploy(incident)}
            className={`px-4 py-2 text-on-error font-label-md text-label-md rounded uppercase tracking-wider hover:opacity-90 transition-opacity ${
              isCritical ? 'bg-error' : 'bg-primary'
            }`}
          >
            {isCritical ? 'Deploy Fire Unit' : 'Notify Local Dept'}
          </button>
        )}
        <button
          onClick={() => onSelect?.(incident)}
          className="px-4 py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded uppercase tracking-wider hover:bg-surface-container-low transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  );
};
export default AlertCard;
