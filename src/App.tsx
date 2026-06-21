import React from 'react';
import { useStore } from './hooks/useStore';
import { AppShell } from './layouts/AppShell';
import { Dashboard } from './pages/Dashboard';
import { MissionControl } from './pages/MissionControl';
import { Analysis } from './pages/Analysis';
import { Officers } from './pages/Officers';
import { Settings } from './pages/Settings';
import { Villages } from './pages/Villages';
import { Reports } from './pages/Reports';
import { CommandPalette } from './components/CommandPalette';
import { PresentationWizard } from './components/PresentationWizard';

import { authService } from './services/authService';

export const App: React.FC = () => {
  const { currentPage, currentRole } = useStore();

  const renderPage = () => {
    // RBAC Security Guard
    if (!authService.hasPageAccess(currentRole, currentPage)) {
      return (
        <div className="p-gutter flex-1 bg-surface flex flex-col justify-center items-center select-none text-center">
          <span className="material-symbols-outlined text-error text-[48px] mb-2">security</span>
          <h2 className="font-headline-md text-headline-md font-bold text-error">Access Restricted</h2>
          <p className="text-on-surface-variant text-body-md mt-1 max-w-sm">
            Your authorization role [{currentRole}] lacks clearance to view the [{currentPage}] cockpit.
          </p>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'mission':
        return <MissionControl />;
      case 'analysis':
        return <Analysis />;
      case 'officers':
        return <Officers />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'villages':
        return <Villages />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppShell>
      {renderPage()}
      <CommandPalette />
      <PresentationWizard />
    </AppShell>
  );
};

export default App;
