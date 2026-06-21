import React, { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { mpDistricts } from '../services/mpMockData';
import { NotificationCenter } from '../components/NotificationCenter';
import { GlobalSearchOverlay } from '../components/GlobalSearchOverlay';

export const TopNavigation: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole,
    isOnline, 
    toggleConnection, 
    sessionTimeRemaining,
    resetSessionTime,
    setCommandPaletteOpen,
    toggleTheme,
    settings,
    setSearchOpen
  } = useStore();

  const [timeStr, setTimeStr] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Update dynamic clock in real-time
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setTimeStr(date.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format session timer
  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRoleChange = (role: any) => {
    setCurrentRole(role);
    setIsProfileOpen(false);
    alert(`Switched workspace session context to role hierarchy: ${role}`);
  };

  return (
    <header className="h-topbar-height w-full bg-surface dark:bg-inverse-surface border-b border-outline-variant flex justify-between items-center px-gutter z-50 select-none">
      
      {/* Brand Government Logo Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* Ashok Chakra Emblem representation */}
          <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center bg-white">
            <span className="material-symbols-outlined text-[18px] text-primary animate-spin-slow">eco</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-primary tracking-widest leading-none">GOVT. OF MADHYA PRADESH</span>
            <h1 className="font-headline-sm text-[16px] font-bold tracking-tight text-on-background dark:text-white leading-tight">
              Prakriti Command Center
            </h1>
          </div>
        </div>

        {/* Environment Badge */}
        <span className="px-2 py-0.5 bg-primary-container text-on-primary-fixed-variant rounded-sm text-[10px] font-bold uppercase font-mono tracking-wider">
          PROD-SECURE
        </span>
      </div>

      {/* Center Utilities: District Selection & Search */}
      <div className="flex items-center gap-4">
        {/* District Selector */}
        <div className="flex items-center bg-surface-container-low px-3 py-1 rounded border border-outline-variant">
          <span className="material-symbols-outlined text-on-surface-variant text-[16px] mr-2">location_city</span>
          <select className="bg-transparent border-none p-0 text-body-sm text-on-surface font-semibold focus:ring-0 cursor-pointer">
            {mpDistricts.map((dist) => (
              <option key={dist} value={dist}>{dist} District</option>
            ))}
          </select>
        </div>

        {/* Global search trigger */}
        <div 
          onClick={() => setSearchOpen(true)}
          className="flex items-center bg-surface-container-low px-3 py-1 rounded border border-outline-variant w-80 cursor-pointer hover:border-primary transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[16px] mr-2">search</span>
          <span className="text-body-sm text-on-surface-variant flex-1">Search districts, villages, assets...</span>
          <span className="text-[10px] font-bold bg-surface-container border border-outline-variant px-1 rounded text-on-surface-variant">/</span>
        </div>
      </div>

      {/* Right Actions Toolbar */}
      <div className="flex items-center gap-4">
        {/* Live dynamic clock */}
        <span className="font-mono-data text-body-sm text-on-surface-variant dark:text-slate-300">
          {timeStr}
        </span>

        {/* Connection status indicator */}
        <button 
          onClick={toggleConnection}
          className="flex items-center gap-1.5 px-2 py-1 bg-surface-container-low border border-outline-variant rounded"
          title="Click to toggle Network Connection Status"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-[10px] uppercase font-bold text-on-surface">
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </button>

        {/* Session Time Tracker */}
        <div className="flex items-center gap-1 px-2 py-1 bg-surface-container-low border border-outline-variant rounded" title="Session time remaining. Click to extend.">
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">hourglass_empty</span>
          <span className="font-mono-data text-body-sm font-bold text-on-surface" onClick={resetSessionTime}>
            {formatSessionTime(sessionTimeRemaining)}
          </span>
        </div>

        {/* Command palette button */}
        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className="p-1.5 hover:bg-surface-container-low border border-outline-variant rounded text-on-surface-variant"
          title="Command Console (Ctrl+K)"
        >
          <span className="material-symbols-outlined text-[18px]">terminal</span>
        </button>

        {/* Theme toggle */}
        <button 
          onClick={toggleTheme}
          className="p-1.5 hover:bg-surface-container-low border border-outline-variant rounded text-on-surface-variant"
          title="Toggle Light/Dark Theme"
        >
          <span className="material-symbols-outlined text-[18px]">
            {settings.theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        {/* Alarm Bell / Notifications Center */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-1.5 hover:bg-surface-container-low border border-outline-variant rounded text-on-surface-variant"
            title="Notification Center"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-[9px] rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </button>
          <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* User profile dropdown and Role Switcher */}
        <div className="relative">
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 bg-surface-container border border-outline-variant rounded-full p-0.5 pr-2 cursor-pointer hover:bg-surface-container-high transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center border border-outline-variant overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="Profile Avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyIWdvYS2TnsCVEP51p5GmwPSV0WbXtbGOwkA__cPhSP2WY2_fZKvbSaJUd7p3mFTv434Zr2jth-UqWoEn_3InBpXy46aEPqCrFL1YX1pE1iStRVc9730w3BcbjfOz4qNx2a2I-ic-UknrxGFRPnb7O-CRc6DihjL5VNEtcKirKts8GgH_8x3ei173o-SBubmAulK1-qctryD61vQZ36QCPQkafU9-V-udmRjUfZv3bj60Jvrtds43DsDgboOXWLGPWAIUqT5mFGA"
              />
            </div>
            <span className="text-body-sm font-bold text-on-surface truncate max-w-[80px]">Collector</span>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-outline-variant shadow-lg rounded-lg py-1 z-50 text-on-surface">
              <div className="px-3 py-2 border-b border-outline-variant bg-surface-container-low">
                <span className="text-[10px] text-on-surface-variant block font-bold uppercase">Authorized Role</span>
                <span className="text-body-sm font-bold text-primary">{currentRole}</span>
              </div>
              {['Collector', 'Commissioner', 'Secretary', 'District Officer', 'Environmental Officer', 'Admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`w-full text-left px-4 py-2 text-body-sm hover:bg-primary-container/20 transition-colors ${
                    currentRole === role ? 'font-bold bg-surface-container' : ''
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Global universal Search console overlay */}
      <GlobalSearchOverlay />
    </header>
  );
};
export default TopNavigation;
