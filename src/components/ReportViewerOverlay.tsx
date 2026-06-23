import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';

interface ReportViewerProps {
  report: { id: string; title: string; category: string; date: string; author: string; status: string } | null;
  onClose: () => void;
}

export const ReportViewerOverlay: React.FC<ReportViewerProps> = ({ report, onClose }) => {
  const { setProcessing, addToast } = useStore();
  const [activeTab, setActiveTab] = useState<'document' | 'summary' | 'history'>('document');

  if (!report) return null;

  const handleDownload = (format: 'PDF' | 'Excel') => {
    setProcessing(true, `Compiling ${format} Data...`);
    setTimeout(() => {
      setProcessing(false);
      addToast(`${report.id} successfully downloaded as ${format}.`, 'success');
    }, 1500);
  };

  const handlePrint = () => {
    setProcessing(true, `Connecting to secure print spooler...`);
    setTimeout(() => {
      setProcessing(false);
      window.print();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-scrim/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex-1 flex justify-center py-6 px-4 sm:px-12 h-full">
        {/* Left Toolbar */}
        <div className="bg-surface border border-outline-variant rounded-l-lg w-16 flex flex-col items-center py-4 gap-4 shadow-xl z-10 shrink-0">
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors mb-4" title="Close Viewer">
            <span className="material-symbols-outlined">close</span>
          </button>
          
          <div className="w-8 h-px bg-outline-variant mb-2" />
          
          <button onClick={() => handleDownload('PDF')} className="w-10 h-10 rounded hover:bg-surface-container flex items-center justify-center text-primary transition-colors" title="Download PDF">
            <span className="material-symbols-outlined">picture_as_pdf</span>
          </button>
          <button onClick={() => handleDownload('Excel')} className="w-10 h-10 rounded hover:bg-surface-container flex items-center justify-center text-green-600 transition-colors" title="Download Excel Data">
            <span className="material-symbols-outlined">table_view</span>
          </button>
          <button onClick={handlePrint} className="w-10 h-10 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" title="Print Document">
            <span className="material-symbols-outlined">print</span>
          </button>
          <button onClick={() => addToast('Share link copied to clipboard.', 'success')} className="w-10 h-10 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" title="Share Document">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>

        {/* Main Document Area */}
        <div className="bg-[#fcfcfc] w-full max-w-4xl h-full flex flex-col rounded-r-lg shadow-2xl overflow-hidden relative">
          
          {/* Document Header */}
          <div className="bg-surface border-b border-outline-variant px-6 py-4 flex justify-between items-center shrink-0">
             <div>
               <div className="flex items-center gap-3">
                 <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border border-primary/20">
                   {report.category}
                 </span>
                 <span className="text-[12px] font-mono font-bold text-on-surface-variant">{report.id}</span>
               </div>
               <h2 className="text-[20px] font-bold text-on-surface mt-1 tracking-tight font-headline">{report.title}</h2>
             </div>
             
             <div className="flex bg-surface-container-low rounded p-1 border border-outline-variant">
               <button onClick={() => setActiveTab('document')} className={`px-4 py-1.5 text-xs font-bold rounded ${activeTab === 'document' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant'}`}>Document</button>
               <button onClick={() => setActiveTab('summary')} className={`px-4 py-1.5 text-xs font-bold rounded flex items-center gap-1 ${activeTab === 'summary' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant'}`}>
                 <span className="material-symbols-outlined text-[14px]">auto_awesome</span> AI Summary
               </button>
               <button onClick={() => setActiveTab('history')} className={`px-4 py-1.5 text-xs font-bold rounded ${activeTab === 'history' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant'}`}>History</button>
             </div>
          </div>

          {/* Document Content */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 document-body relative">
             {/* Simulated A4 Paper Look */}
             <div className="max-w-3xl mx-auto bg-white min-h-[800px] shadow-sm border border-outline-variant/50 p-10 font-serif text-on-surface relative">
               
               {/* Govt Letterhead */}
               <div className="text-center border-b-2 border-on-surface pb-6 mb-8">
                 <h1 className="text-2xl font-bold uppercase tracking-widest font-sans">Government of Madhya Pradesh</h1>
                 <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mt-1 font-sans">Department of Environmental Operations</h3>
                 <div className="mt-4 flex justify-between text-xs font-mono">
                   <span>Ref: {report.id}</span>
                   <span>Date: {report.date}</span>
                 </div>
               </div>

               {activeTab === 'summary' ? (
                 <div className="space-y-4 font-sans text-sm leading-relaxed bg-primary/5 p-6 rounded border border-primary/20">
                   <div className="flex items-center gap-2 text-primary font-bold mb-4 uppercase tracking-widest text-xs">
                     <span className="material-symbols-outlined">auto_awesome</span> Executive AI Brief
                   </div>
                   <p>This report details the systematic evaluation of <strong>{report.title}</strong> compiled by {report.author}.</p>
                   <ul className="list-disc pl-5 space-y-2 mt-4">
                     <li>Critical findings indicate a stable variance within the acceptable 5% threshold.</li>
                     <li>Immediate attention is required for the peripheral sensors mapped in Section 3.</li>
                     <li>Confidence score for the data models used is <strong>96.4%</strong>.</li>
                   </ul>
                   <p className="mt-4 italic text-on-surface-variant text-xs">Generated by Prakriti Analysis Engine.</p>
                 </div>
               ) : activeTab === 'history' ? (
                 <div className="space-y-6 font-sans">
                   <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b pb-2">Document Version History</h3>
                   <div className="border-l-2 border-outline-variant pl-4 space-y-4">
                     <div>
                       <div className="text-xs font-mono text-on-surface-variant">{report.date}</div>
                       <div className="font-bold">Status: {report.status}</div>
                       <div className="text-sm">Signed by {report.author}</div>
                     </div>
                     <div>
                       <div className="text-xs font-mono text-on-surface-variant">2026-06-01</div>
                       <div className="font-bold">Status: Draft Created</div>
                       <div className="text-sm">Initial compilation by Automated Telemetry Batch.</div>
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="space-y-6 text-sm leading-relaxed">
                   <h2 className="text-xl font-bold font-sans">{report.title}</h2>
                   <p>This official document serves as the formalized record for the {report.category} operational metrics. The data encapsulated within this report was harvested from the centralized GIS command center and verified by the designated field officers.</p>
                   
                   <h3 className="text-lg font-bold font-sans mt-8">1. Executive Overview</h3>
                   <p>The operational capabilities deployed in the specific region have yielded the telemetry responses enclosed. Variances between projected vs. actual data points highlight key focus areas for the upcoming quarter.</p>

                   <div className="my-8 bg-surface-container p-4 border border-outline-variant font-sans text-center">
                     [ Data Visualizations & Charts Omitted for Digital Preview ]
                   </div>

                   <h3 className="text-lg font-bold font-sans mt-8">2. Recommendations</h3>
                   <p>It is advised that the command hierarchy reviews the appended sensor logs. Budgetary allocations for the next fiscal must reflect the 12% operational deficiency noted in the northern grid.</p>

                   {/* Signature Block */}
                   <div className="mt-16 flex justify-end">
                     <div className="text-center">
                       <div className="w-48 h-16 border-b border-on-surface mb-2 relative">
                         {report.status === 'Finalized' && (
                           <span className="absolute inset-0 flex justify-center items-center font-cursive text-3xl text-primary opacity-80 transform -rotate-12 select-none">
                             {report.author}
                           </span>
                         )}
                       </div>
                       <div className="font-bold font-sans uppercase text-xs">{report.author}</div>
                       <div className="text-xs text-on-surface-variant font-sans">Authorized Signatory</div>
                       <div className="text-[10px] text-on-surface-variant font-mono mt-1">Digital Signature Verified</div>
                     </div>
                   </div>

                 </div>
               )}

             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
