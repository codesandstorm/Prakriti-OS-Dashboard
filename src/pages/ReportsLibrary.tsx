import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { ReportViewerOverlay } from '../components/ReportViewerOverlay';

import { KpiCard } from '../components/KpiCard';

let mockReports = [
  { id: 'RPT-8821', title: 'Q2 Groundwater Depletion Analysis', category: 'Hydrology', date: '2026-06-20', author: 'Dr. A. Sharma', size: '2.4 MB', status: 'Finalized' },
  { id: 'RPT-8822', title: 'Industrial Compliance Audit - Sector 4', category: 'Compliance', date: '2026-06-18', author: 'Insp. R. Singh', size: '1.1 MB', status: 'Draft' },
  { id: 'RPT-8823', title: 'Satpura Forest NDVI Satellite Scan', category: 'Forestry', date: '2026-06-15', author: 'System Auto', size: '14.5 MB', status: 'Finalized' },
  { id: 'RPT-8824', title: 'Carbon Sequestration Payout Ledger', category: 'Finance', date: '2026-06-10', author: 'Finance Dept', size: '0.8 MB', status: 'Pending Review' },
  { id: 'RPT-8825', title: 'Air Quality Index Forecast Winter 26', category: 'Atmospheric', date: '2026-06-05', author: 'Dr. V. Patel', size: '3.2 MB', status: 'Finalized' }
];

export const ReportsLibrary: React.FC = () => {
  const { setProcessing, addToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [reportsList, setReportsList] = useState(mockReports);
  const [viewingReport, setViewingReport] = useState<any | null>(null);

  const handleGenerateReport = () => {
    setProcessing(true, "Compiling District Environmental Report...");
    setTimeout(() => {
      const newReport = {
        id: `RPT-88${Math.floor(Math.random() * 90 + 10)}`,
        title: 'Auto-Generated Executive Brief',
        category: 'Atmospheric',
        date: new Date().toISOString().split('T')[0],
        author: 'Collector Node',
        size: '1.2 MB',
        status: 'Finalized'
      };
      setReportsList([newReport, ...reportsList]);
      setProcessing(false);
      addToast('Report generated successfully and saved to Library.', 'success');
      setViewingReport(newReport);
    }, 2500);
  };
  
  const categories = ['All', 'Hydrology', 'Compliance', 'Forestry', 'Finance', 'Atmospheric'];

  const filteredReports = reportsList.filter(r => {
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-surface-container-low text-on-surface">
      <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full">
        
        {/* Page Header */}
        <div className="flex justify-between items-end border-b border-outline-variant pb-4">
          <div>
            <h1 className="text-display-sm font-bold text-on-surface tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[32px]">folder_open</span>
              Reports Library
            </h1>
            <p className="text-sm font-mono-data text-on-surface-variant uppercase tracking-widest mt-1">
              Document Intelligence & Archive
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 border border-outline hover:bg-surface-container text-on-surface font-bold text-xs rounded uppercase tracking-wider transition-colors">
               <span className="material-symbols-outlined text-[16px]">schedule</span>
               Scheduled
             </button>
             <button onClick={handleGenerateReport} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded uppercase tracking-wider hover:bg-primary/90 transition-colors">
               <span className="material-symbols-outlined text-[16px]">add</span>
               Generate Report
             </button>
          </div>
        </div>

        {/* Executive KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard 
            label="Total Documents" 
            value="1,402" 
            trend="Added" trendDirection="up" 
            historicalComparison="42 added this month" 
            dataSource="Document Store" 
          />
          <KpiCard 
            label="Pending Reviews" 
            value="14" 
            trend="Added" trendDirection="up" 
            historicalComparison="Requires signature" 
            dataSource="Workflow Engine" 
            statusIndicator="fair"
          />
          <KpiCard 
            label="Auto-Generated" 
            value="85%" 
            trend="Scheduled" trendDirection="stable" 
            historicalComparison="AI scheduled tasks" 
            dataSource="System Auto" 
          />
          <KpiCard 
            label="Archive Size" 
            value="42.5 GB" 
            trend="Added" trendDirection="up" 
            historicalComparison="Within quota" 
            dataSource="Cloud Storage" 
          />
        </div>

        {/* Primary Workspace */}
        <div className="bg-surface border border-outline-variant rounded-lg shadow-sm flex flex-col min-h-[500px]">
          
          <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
            <div className="flex gap-2">
              {categories.map(c => (
                <button 
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded border transition-colors ${
                    selectedCategory === c ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-surface border border-outline-variant rounded px-3 py-1.5 text-xs">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">search</span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Title or ID..."
                className="bg-transparent focus:outline-none w-64 text-on-surface"
              />
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Report ID</th>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredReports.map(r => (
                  <tr key={r.id} className="hover:bg-surface-container transition-colors group cursor-pointer">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{r.id}</td>
                    <td className="py-3 px-4 font-semibold">{r.title}</td>
                    <td className="py-3 px-4">
                      <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] uppercase">{r.category}</span>
                    </td>
                    <td className="py-3 px-4 font-mono-data text-on-surface-variant">{r.date}</td>
                    <td className="py-3 px-4">{r.author}</td>
                    <td className="py-3 px-4 font-mono-data text-on-surface-variant">{r.size}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        r.status === 'Finalized' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                        r.status === 'Draft' ? 'bg-surface-container-high text-on-surface-variant border border-outline' :
                        'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewingReport(r)} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors" title="View Document">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setProcessing(true, 'Preparing PDF Download...'); setTimeout(() => { setProcessing(false); addToast('PDF Downloaded.', 'success'); }, 1200); }} className="text-on-surface-variant hover:bg-surface-container-high p-1 rounded transition-colors" title="Download PDF">
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setProcessing(true, 'Fetching Audit Trail...'); setTimeout(() => { setProcessing(false); addToast('Audit Trail verified cryptographically.', 'success'); }, 1200); }} className="text-on-surface-variant hover:bg-surface-container-high p-1 rounded transition-colors" title="Audit Trail">
                          <span className="material-symbols-outlined text-[18px]">history</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-on-surface-variant italic">
                      No documents found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
      
      {viewingReport && (
        <ReportViewerOverlay 
          report={viewingReport} 
          onClose={() => setViewingReport(null)} 
        />
      )}
    </div>
  );
};

export default ReportsLibrary;
