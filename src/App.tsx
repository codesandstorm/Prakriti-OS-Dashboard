import React, { Suspense } from 'react';
import { useStore } from './hooks/useStore';
import { AppShell } from './layouts/AppShell';
import { CommandPalette } from './components/CommandPalette';
import { PresentationWizard } from './components/PresentationWizard';
import { GlobalLoadingSkeleton } from './components/GlobalLoadingSkeleton';
import { authService } from './services/authService';

// Lazy loaded modules for enterprise performance
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const MissionControl = React.lazy(() => import('./pages/MissionControl').then(module => ({ default: module.MissionControl })));
const Analysis = React.lazy(() => import('./pages/Analysis').then(module => ({ default: module.Analysis })));
const Officers = React.lazy(() => import('./pages/Officers').then(module => ({ default: module.Officers })));
const Settings = React.lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Villages = React.lazy(() => import('./pages/Villages').then(module => ({ default: module.Villages })));
const Reports = React.lazy(() => import('./pages/Reports').then(module => ({ default: module.Reports })));

export const App: React.FC = () => {
  const { currentPage, currentRole } = useStore();

  const renderPage = () => {
    // RBAC Security Guard
    if (!authService.hasPageAccess(currentRole, currentPage)) {
      return (
        <div className="p-gutter flex-1 bg-surface flex flex-col justify-center items-center select-none text-center">
          <span className="material-symbols-outlined text-error text-[48px] mb-2" aria-hidden="true">security</span>
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
      <Suspense fallback={<GlobalLoadingSkeleton />}>
        {renderPage()}
      </Suspense>
      <CommandPalette />
      <PresentationWizard />
    </AppShell>
  );
};

export default App;
