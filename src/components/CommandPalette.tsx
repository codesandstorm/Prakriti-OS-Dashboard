import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../hooks/useStore';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setCurrentPage } = useStore();
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      inputRef.current?.focus();
    } else {
      setSearch('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const commands = [
    { name: 'Go to Operational Dashboard', icon: 'dashboard', action: () => setCurrentPage('dashboard') },
    { name: 'Go to GIS Intelligence Map', icon: 'map', action: () => setCurrentPage('mission') },
    { name: 'Go to Environmental Analysis & Trends', icon: 'bar_chart', action: () => setCurrentPage('analysis') },
    { name: 'Go to Officer Directory', icon: 'badge', action: () => setCurrentPage('officers') },
    { name: 'Go to Reports Library', icon: 'description', action: () => setCurrentPage('reports') },
    { name: 'Go to System Settings', icon: 'settings', action: () => setCurrentPage('settings') },
    { name: 'Filter: Show All Jurisdictions', icon: 'filter_alt', action: () => alert('Quick Filter: All Jurisdictions applied') },
    { name: 'Filter: Focus Indore Region', icon: 'location_city', action: () => alert('Quick Filter: Indore District focused') },
    { name: 'Mitigation: Launch AI Predictive Modeling', icon: 'auto_awesome', action: () => setCurrentPage('analysis') }
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[100] flex items-start justify-center pt-20">
      <div 
        className="w-full max-w-xl bg-white rounded-lg border border-outline-variant shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-outline-variant bg-surface-container-low">
          <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-body-md placeholder-on-surface-variant text-on-surface focus:ring-0 p-0"
            placeholder="Type a command or screen to jump to..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            onClick={() => setCommandPaletteOpen(false)}
            className="text-[11px] font-bold text-on-surface-variant bg-surface-container border border-outline-variant px-1.5 py-0.5 rounded"
          >
            ESC
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => {
                  cmd.action();
                  setCommandPaletteOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-primary-container/20 hover:text-primary rounded flex items-center gap-3 transition-colors text-body-md text-on-surface"
              >
                <span className="material-symbols-outlined text-on-surface-variant">{cmd.icon}</span>
                <span>{cmd.name}</span>
              </button>
            ))
          ) : (
            <div className="text-center py-6 text-body-sm text-on-surface-variant">
              No matching commands found.
            </div>
          )}
        </div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={() => setCommandPaletteOpen(false)} />
    </div>
  );
};
export default CommandPalette;
