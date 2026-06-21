import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-sidebar-width h-full overflow-hidden">
        <TopNavigation />
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
