import React from 'react';
import { useStore } from '../hooks/useStore';

export const Breadcrumbs: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage,
    selectedOfficer,
    selectedIncident
  } = useStore();

  const getPageLabel = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Overview';
      case 'mission':
        return 'GIS Intelligence';
      case 'analysis':
        return 'Analytics Desk';
      case 'officers':
        return 'Officer Directory';
      case 'reports':
        return 'Reports Library';
      case 'settings':
        return 'System Settings';
      default:
        return 'Overview';
    }
  };

  const crumbs = [
    { label: 'Prakriti Command', action: () => setCurrentPage('dashboard') }
  ];

  if (currentPage !== 'dashboard') {
    crumbs.push({ 
      label: getPageLabel(), 
      action: () => setCurrentPage(currentPage) 
    });
  }

  // If a profile/detail drawer is open, show the active entity
  if (currentPage === 'officers' && selectedOfficer) {
    crumbs.push({
      label: selectedOfficer.name,
      action: () => {}
    });
  } else if (currentPage === 'mission' && selectedIncident) {
    crumbs.push({
      label: `Incident ${selectedIncident.code}`,
      action: () => {}
    });
  }

  return (
    <div className="flex items-center gap-1.5 text-on-surface-variant font-medium select-none">
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            )}
            <button
              onClick={crumb.action}
              className={`hover:text-primary transition-colors ${
                isLast ? 'text-primary font-bold pointer-events-none' : 'text-on-surface-variant'
              }`}
              disabled={isLast}
            >
              {crumb.label}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};
export default Breadcrumbs;
