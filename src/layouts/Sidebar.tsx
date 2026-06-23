import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';

interface NavItem {
  id: 'dashboard' | 'active-alerts' | 'gis-intelligence' | 'analytics-desk' | 'ai-decision-center' | 'reports-library' | 'schemes-grants' | 'villages' | 'officers' | 'settings';
  label: string;
  icon: string;
  roles?: string[];
  children?: { label: string; action: () => void }[];
}

export const Sidebar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    isSidebarExpanded, 
    toggleSidebar, 
    currentRole 
  } = useStore();

  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { 
      id: 'dashboard', 
      label: 'Overview', 
      icon: 'grid_view' 
    },
    { 
      id: 'gis-intelligence', 
      label: 'GIS Intelligence', 
      icon: 'map',
      children: [
        { label: 'Satellite Feed', action: () => setCurrentPage('gis-intelligence') },
        { label: 'Telemetry Grid', action: () => setCurrentPage('gis-intelligence') }
      ]
    },
    { 
      id: 'villages', 
      label: 'Village Intelligence', 
      icon: 'home',
      roles: ['Collector', 'Commissioner', 'Secretary', 'District Officer', 'Admin']
    },
    { 
      id: 'ai-decision-center', 
      label: 'AI Decision Center', 
      icon: 'auto_awesome',
      roles: ['Collector', 'Commissioner', 'Secretary', 'Admin']
    },
    { 
      id: 'schemes-grants', 
      label: 'Schemes & Grants', 
      icon: 'payments',
      roles: ['Collector', 'Commissioner', 'Secretary', 'Admin']
    },
    { 
      id: 'active-alerts', 
      label: 'Active Alerts', 
      icon: 'notifications_active' 
    },
    { 
      id: 'analytics-desk', 
      label: 'Analytics Desk', 
      icon: 'bar_chart' 
    },
    { 
      id: 'reports-library', 
      label: 'Reports Library', 
      icon: 'description' 
    },
    { 
      id: 'officers', 
      label: 'Officer Directory', 
      icon: 'badge',
      roles: ['Collector', 'Commissioner', 'Admin'] 
    },
    { 
      id: 'settings', 
      label: 'System Settings', 
      icon: 'settings' 
    }
  ];

  const filteredItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(currentRole);
  });

  const handleSubmenuToggle = (label: string) => {
    if (expandedSubmenu === label) {
      setExpandedSubmenu(null);
    } else {
      setExpandedSubmenu(label);
    }
  };

  return (
    <aside 
      className={`fixed left-0 top-topbar-height h-[calc(100vh-56px)] bg-primary z-50 flex flex-col border-r border-outline-variant transition-all duration-300 ${
        isSidebarExpanded ? 'w-sidebar-expanded' : 'w-sidebar-width'
      }`}
    >
      {/* Expand/Collapse Trigger */}
      <button 
        onClick={toggleSidebar}
        className="w-full h-8 flex items-center justify-end px-4 text-on-primary-fixed-variant hover:text-primary-fixed hover:bg-primary-container/40 transition-colors"
        title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        <span className="material-symbols-outlined text-[18px]">
          {isSidebarExpanded ? 'menu_open' : 'menu'}
        </span>
      </button>

      {/* Nav Link Items */}
      <nav className="flex-1 flex flex-col gap-1 py-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {filteredItems.map((item, index) => {
          const isActive = currentPage === item.id;
          const hasChildren = item.children && item.children.length > 0;
          const isSubmenuOpen = expandedSubmenu === item.label;

          return (
            <div key={index} className="w-full flex flex-col">
              <button
                onClick={() => {
                  if (hasChildren && isSidebarExpanded) {
                    handleSubmenuToggle(item.label);
                  } else {
                    setCurrentPage(item.id);
                  }
                }}
                className={`w-full flex items-center gap-4 py-2 transition-all text-left relative border-l-[3px] ${
                  isSidebarExpanded ? 'px-3 justify-between' : 'justify-center'
                } ${
                  isActive 
                    ? 'text-primary-fixed bg-primary-container/90 border-primary-fixed font-bold' 
                    : 'text-on-primary-fixed-variant hover:text-primary-fixed hover:bg-primary-container/40 border-transparent'
                }`}
                title={!isSidebarExpanded ? item.label : undefined}
              >
                <div className="flex items-center gap-4">
                  <span 
                    className="material-symbols-outlined text-[20px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  {isSidebarExpanded && (
                    <span className="text-body-sm truncate">{item.label}</span>
                  )}
                </div>

                {hasChildren && isSidebarExpanded && (
                  <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${isSubmenuOpen ? 'rotate-90' : ''}`}>
                    chevron_right
                  </span>
                )}
              </button>

              {/* Sub-menu nested list */}
              {hasChildren && isSidebarExpanded && isSubmenuOpen && (
                <div className="bg-primary-container/20 flex flex-col py-1 border-l-2 border-primary-fixed ml-6">
                  {item.children?.map((child, childIdx) => (
                    <button
                      key={childIdx}
                      onClick={child.action}
                      className="text-left px-6 py-1.5 text-[12px] text-on-primary-fixed-variant hover:text-primary-fixed hover:bg-primary-container/40 transition-colors"
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Role Badge Status indicator */}
      <div className="p-3 border-t border-primary-container/30 bg-primary-container/10 flex flex-col items-center">
        {isSidebarExpanded ? (
          <div className="w-full text-center">
            <span className="text-[10px] text-primary-fixed uppercase tracking-wider block font-bold">Role Hierarchy</span>
            <span className="text-body-sm text-white font-semibold">{currentRole}</span>
          </div>
        ) : (
          <span className="material-symbols-outlined text-primary-fixed" title={`Role: ${currentRole}`}>
            shield_person
          </span>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
