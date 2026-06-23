import React, { Suspense } from 'react';
import { useStore } from './hooks/useStore';
import { AppShell } from './layouts/AppShell';
import { CommandPalette } from './components/CommandPalette';
import { PresentationWizard } from './components/PresentationWizard';
import { GlobalLoadingSkeleton } from './components/GlobalLoadingSkeleton';
import { GlobalProcessingOverlay } from './components/GlobalProcessingOverlay';
import { authService } from './services/authService';

// Lazy loaded modules for enterprise performance
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const MissionControl = React.lazy(() => import('./pages/MissionControl').then(module => ({ default: module.MissionControl })));
const Analysis = React.lazy(() => import('./pages/Analysis').then(module => ({ default: module.Analysis })));
const Officers = React.lazy(() => import('./pages/Officers').then(module => ({ default: module.Officers })));
const Settings = React.lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Villages = React.lazy(() => import('./pages/Villages').then(module => ({ default: module.Villages })));
const ActiveAlerts = React.lazy(() => import('./pages/ActiveAlerts').then(module => ({ default: module.ActiveAlerts })));
const AiDecisionCenter = React.lazy(() => import('./pages/AiDecisionCenter').then(module => ({ default: module.AiDecisionCenter })));
const ReportsLibrary = React.lazy(() => import('./pages/ReportsLibrary').then(module => ({ default: module.ReportsLibrary })));
const SchemesGrants = React.lazy(() => import('./pages/SchemesGrants').then(module => ({ default: module.SchemesGrants })));

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
      case 'active-alerts':
        return <ActiveAlerts />;
      case 'gis-intelligence':
        return <MissionControl />;
      case 'analytics-desk':
        return <Analysis />;
      case 'ai-decision-center':
        return <AiDecisionCenter />;
      case 'reports-library':
        return <ReportsLibrary />;
      case 'schemes-grants':
        return <SchemesGrants />;
      case 'officers':
        return <Officers />;
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
      <GlobalProcessingOverlay />
      <CommandPalette />
      <PresentationWizard />
    </AppShell>
  );
};

export default App;
