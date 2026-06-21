import React, { useEffect, useRef } from 'react';
import { useStore } from '../hooks/useStore';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { InspectorDrawer } from '../components/InspectorDrawer';
import { BottomAnalyticsDock } from '../components/BottomAnalyticsDock';
import { ToastContainer } from '../components/ToastContainer';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { 
    isSidebarExpanded, 
    isDrawerOpen, 
    drawerWidth, 
    setDrawerWidth,
    isDockExpanded,
    dockHeight,
    setDockHeight,
    decrementSessionTime,
    settings,
    presentationMode
  } = useStore();

  const isResizingDrawer = useRef(false);
  const isResizingDock = useRef(false);

  // Sync theme class
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Session timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      decrementSessionTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [decrementSessionTime]);

  const startResizeDrawer = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingDrawer.current = true;
    document.addEventListener('mousemove', handleResizeDrawer);
    document.addEventListener('mouseup', stopResizeDrawer);
  };

  const handleResizeDrawer = (e: MouseEvent) => {
    if (!isResizingDrawer.current) return;
    const newWidth = window.innerWidth - e.clientX;
    setDrawerWidth(newWidth);
  };

  const stopResizeDrawer = () => {
    isResizingDrawer.current = false;
    document.removeEventListener('mousemove', handleResizeDrawer);
    document.removeEventListener('mouseup', stopResizeDrawer);
  };

  const startResizeDock = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingDock.current = true;
    document.addEventListener('mousemove', handleResizeDock);
    document.addEventListener('mouseup', stopResizeDock);
  };

  const handleResizeDock = (e: MouseEvent) => {
    if (!isResizingDock.current) return;
    const newHeight = window.innerHeight - e.clientY;
    setDockHeight(newHeight);
  };

  const stopResizeDock = () => {
    isResizingDock.current = false;
    document.removeEventListener('mousemove', handleResizeDock);
    document.removeEventListener('mouseup', stopResizeDock);
  };

  const sidebarWidthClass = isSidebarExpanded ? 'pl-sidebar-expanded' : 'pl-sidebar-width';

  if (presentationMode) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-on-surface font-body-md transition-colors duration-200 select-none">
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col bg-background text-on-surface font-body-md transition-colors duration-200 select-none`}>
      {/* Top Navbar */}
      <TopNavigation />

      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Workspace Central Pane */}
        <div 
          className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${sidebarWidthClass}`}
          style={{ 
            paddingRight: isDrawerOpen ? `${drawerWidth}px` : '0px',
            paddingBottom: isDockExpanded ? `${dockHeight}px` : '40px' 
          }}
        >
          {/* Automatic dynamic breadcrumbs */}
          <div className="bg-surface-container-low px-gutter py-2 border-b border-outline-variant flex items-center gap-2 text-xs">
            <Breadcrumbs />
          </div>

          {/* Child module page container */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            {children}
          </div>
        </div>

        {/* Resizable Inspector Drawer */}
        <div 
          className={`fixed right-0 top-topbar-height bottom-0 z-40 bg-white border-l border-outline-variant flex transition-transform duration-300 ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ width: `${drawerWidth}px` }}
        >
          {/* Resize Handler */}
          <div 
            onMouseDown={startResizeDrawer}
            className="w-1 cursor-col-resize h-full bg-outline-variant hover:bg-primary/50 transition-colors absolute left-0 z-50"
          />
          <InspectorDrawer />
        </div>

        {/* Resizable Bottom Analytics Dock */}
        <div 
          className={`fixed bottom-0 right-0 z-30 bg-surface border-t border-outline-variant flex flex-col transition-all duration-300 ${
            isDockExpanded ? '' : 'h-10'
          }`}
          style={{ 
            left: isSidebarExpanded ? 'var(--spacing-sidebar-expanded)' : 'var(--spacing-sidebar-width)',
            height: isDockExpanded ? `${dockHeight}px` : '40px',
            width: isDrawerOpen ? `calc(100% - ${drawerWidth}px - (isSidebarExpanded ? 240px : 64px))` : 'auto'
          }}
        >
          {/* Resize Handler */}
          {isDockExpanded && (
            <div 
              onMouseDown={startResizeDock}
              className="h-1 cursor-row-resize w-full bg-outline-variant hover:bg-primary/50 transition-colors absolute top-0 z-50"
            />
          )}
          <BottomAnalyticsDock />
        </div>
      </div>

      {/* Global Alerts & Toast notifications overlay */}
      <ToastContainer />
    </div>
  );
};

export default AppShell;
