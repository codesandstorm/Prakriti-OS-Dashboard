import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../hooks/useStore';
import { mpDistricts, mpVillages, mpOfficers, mpSchemes, mpEnvAssets } from '../services/mpMockData';

export const GlobalSearchOverlay: React.FC = () => {
  const { 
    isSearchOpen, 
    setSearchOpen, 
    searchQuery, 
    recentSearches, 
    addRecentSearch, 
    clearRecentSearches,
    setSelectedOfficer,
    setSelectedVillage,
    setSelectedScheme,
    setCurrentPage,
    setDashboardFilter,
    addToast
  } = useStore();

  const [inputVal, setInputVal] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Trigger search with '/' key globally
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setInputVal(searchQuery);
    }
  }, [isSearchOpen, searchQuery]);

  if (!isSearchOpen) return null;

  // Search filter categorizations
  const filteredDistricts = mpDistricts.filter(d => d.toLowerCase().includes(inputVal.toLowerCase())).slice(0, 3);
  const filteredVillages = mpVillages.filter(v => v.name.toLowerCase().includes(inputVal.toLowerCase())).slice(0, 3);
  const filteredOfficers = mpOfficers.filter(o => o.name.toLowerCase().includes(inputVal.toLowerCase())).slice(0, 3);
  const filteredSchemes = mpSchemes.filter(s => s.name.toLowerCase().includes(inputVal.toLowerCase())).slice(0, 3);
  const filteredAssets = mpEnvAssets.filter(a => a.name.toLowerCase().includes(inputVal.toLowerCase())).slice(0, 3);

  const allResults: { type: string; name: string; item: any; action: () => void }[] = [];

  filteredDistricts.forEach(d => allResults.push({ 
    type: 'District', name: d, item: d, 
    action: () => { setDashboardFilter('district', d); setCurrentPage('dashboard'); addToast(`Navigated to ${d} District Dashboard`, 'success'); } 
  }));
  filteredVillages.forEach(v => allResults.push({ 
    type: 'Village', name: `${v.name} (${v.district})`, item: v, 
    action: () => { setSelectedVillage(v); setCurrentPage('villages'); addToast(`Opened Inspector for ${v.name}`, 'success'); } 
  }));
  filteredOfficers.forEach(o => allResults.push({ 
    type: 'Officer', name: `${o.name} - ${o.designation}`, item: o, 
    action: () => { setSelectedOfficer(o); setCurrentPage('officers'); addToast(`Viewing profile of ${o.name}`, 'success'); } 
  }));
  filteredSchemes.forEach(s => allResults.push({ 
    type: 'Scheme', name: s.name, item: s, 
    action: () => { setSelectedScheme(s); setCurrentPage('analysis'); addToast(`Analyzing scheme: ${s.name}`, 'success'); } 
  }));
  filteredAssets.forEach(a => allResults.push({ 
    type: 'Asset', name: `${a.name} (${a.category})`, item: a, 
    action: () => { setCurrentPage('mission'); addToast(`Viewing GIS asset metadata: ${a.name}`, 'success'); } 
  }));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        allResults[selectedIndex].action();
        addRecentSearch(inputVal);
        setSearchOpen(false);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  const handleRecentClick = (q: string) => {
    setInputVal(q);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[100] flex items-start justify-center pt-20">
      <div 
        className="w-full max-w-2xl bg-white border border-outline-variant shadow-2xl rounded-lg overflow-hidden flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b border-outline-variant bg-surface-container-low">
          <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-body-md placeholder-on-surface-variant text-on-surface focus:ring-0 p-0"
            placeholder="Search districts, villages, environmental schemes or active officers..."
            value={inputVal}
            onChange={(e) => { setInputVal(e.target.value); setSelectedIndex(0); }}
          />
          <button 
            onClick={() => setSearchOpen(false)}
            className="text-[10px] font-bold text-on-surface-variant bg-surface-container border border-outline-variant px-2 py-0.5 rounded"
          >
            ESC
          </button>
        </div>

        <div className="flex divide-x divide-outline-variant max-h-96">
          {/* Results Side */}
          <div className="flex-1 overflow-y-auto p-2">
            {allResults.length > 0 ? (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase px-3 py-1 block">Search Results</span>
                {allResults.map((res, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        res.action();
                        addRecentSearch(inputVal);
                        setSearchOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded flex items-center justify-between text-body-sm transition-colors ${
                        isSelected 
                          ? 'bg-primary-container/20 text-primary font-bold' 
                          : 'text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                          {res.type === 'District' ? 'location_city' :
                           res.type === 'Village' ? 'home' :
                           res.type === 'Officer' ? 'badge' :
                           res.type === 'Scheme' ? 'payments' : 'layers'}
                        </span>
                        <span>{res.name}</span>
                      </div>
                      <span className="text-[9px] bg-surface-container px-1.5 py-0.5 border border-outline-variant rounded text-on-surface-variant">
                        {res.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-body-sm text-on-surface-variant">
                {inputVal ? 'No results matched.' : 'Type query to find records.'}
              </div>
            )}
          </div>

          {/* Recent Searches Side */}
          <div className="w-52 p-3 bg-surface-container-low flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-outline-variant pb-1">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Recent Searches</span>
              {recentSearches.length > 0 && (
                <button onClick={clearRecentSearches} className="text-[9px] text-error hover:underline font-bold">Clear</button>
              )}
            </div>
            {recentSearches.length > 0 ? (
              <div className="flex flex-col gap-1">
                {recentSearches.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRecentClick(q)}
                    className="text-left px-2 py-1 text-xs text-on-surface-variant hover:text-primary hover:bg-surface-container rounded truncate"
                  >
                    {q}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-[10px] text-on-surface-variant italic">No recent searches.</span>
            )}
          </div>
        </div>
      </div>
      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={() => setSearchOpen(false)} />
    </div>
  );
};
export default GlobalSearchOverlay;
