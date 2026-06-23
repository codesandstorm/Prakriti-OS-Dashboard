import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { schemeMetrics, budgetMetrics, pensionDistributions, carbonIncentives } from '../services/analyticsMockData';

export const SchemesGrants: React.FC = () => {
  const { 
    analyticsTab, 
    setAnalyticsTab, 
    presentationMode, 
    setPresentationMode 
  } = useStore();

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Excel / CSV export simulations
  const handleExportCSV = (filename: string, headers: string[], rows: string[][]) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerMockCSVExport = () => {
    if (analyticsTab === 'schemes') {
      const headers = ['Scheme ID', 'Name', 'Allocated Cr', 'Spent Cr', 'Beneficiaries', 'Completion %'];
      const rows = schemeMetrics.map(s => [s.id, s.name, s.budgetAllocatedCr.toString(), s.budgetSpentCr.toString(), s.activeBeneficiaries.toString(), `${s.completionPct}%`]);
      handleExportCSV('Scheme_Monitoring_Report', headers, rows);
    } else if (analyticsTab === 'budget') {
      const headers = ['Budget ID', 'Department', 'Allocated Cr', 'Utilized Cr', 'Committed Cr', 'Audit Status'];
      const rows = budgetMetrics.map(b => [b.id, b.department, b.allocatedInrCr.toString(), b.utilizedInrCr.toString(), b.commitedInrCr.toString(), b.auditStatus]);
      handleExportCSV('Budget_Utilization_Report', headers, rows);
    } else if (analyticsTab === 'pensions') {
      const headers = ['Pension ID', 'Village', 'Farmers Count', 'Amount distributed Lakhs', 'Compliance %'];
      const rows = pensionDistributions.map(p => [p.id, p.villageName, p.eligibleFarmers.toString(), p.distributedInrLakhs.toString(), `${p.complianceRate}%`]);
      handleExportCSV('Pension_Distribution_Report', headers, rows);
    } else {
      const headers = ['Incentive ID', 'Village', 'Verified credits Kt', 'Amount paid Lakhs', 'Verification Agency', 'Status'];
      const rows = carbonIncentives.map(c => [c.id, c.villageName, c.creditsVerifiedKt.toString(), c.incentivePaidInrLakhs.toString(), c.verificationAgency, c.payoutStatus]);
      handleExportCSV('Carbon_Incentives_Payout_Report', headers, rows);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Sort and Search Logic
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortedData = (data: any[]) => {
    let filtered = data.filter(item => {
      const stringified = Object.values(item).join(' ').toLowerCase();
      return stringified.includes(searchTerm.toLowerCase());
    });

    if (sortBy) {
      filtered.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return sortOrder === 'asc' 
          ? String(valA).localeCompare(String(valB)) 
          : String(valB).localeCompare(String(valA));
      });
    }
    return filtered;
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-surface text-on-surface select-none">
      
      {/* Presentation view overlay toggle back */}
      {presentationMode && (
        <button 
          onClick={() => setPresentationMode(false)}
          className="fixed right-4 top-4 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase px-4 py-2 rounded-full shadow-lg z-[200] flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">close_fullscreen</span>
          Exit Presentation
        </button>
      )}

      {/* Page Header */}
      <div className="bg-surface border-b border-outline-variant px-6 py-4 pb-4">
        <h1 className="text-display-sm font-bold text-on-surface tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[32px]">payments</span>
          Schemes & Grants
        </h1>
        <p className="text-sm font-mono-data text-on-surface-variant uppercase tracking-widest mt-1">
          Funding Intelligence & Budget Utilization
        </p>
      </div>

      {/* Control bar */}
      <section className="bg-white border-b border-outline-variant px-gutter py-3.5 flex flex-wrap gap-4 items-center justify-between shadow-xs">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="material-symbols-outlined text-primary text-[24px]">analytics</span>
          <div className="flex items-center gap-1 bg-surface-container border border-outline-variant rounded px-2.5 py-1 text-xs">
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">search</span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search report table..."
              className="bg-transparent focus:outline-none w-44 text-on-surface"
            />
          </div>

          {/* Tab Toggles */}
          <div className="flex bg-surface-container border border-outline-variant rounded p-0.5 text-xs font-bold">
            <button 
              onClick={() => { setAnalyticsTab('schemes'); setSelectedRowId(null); }}
              className={`px-3 py-1.5 rounded transition-all ${analyticsTab === 'schemes' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface'}`}
            >
              Schemes
            </button>
            <button 
              onClick={() => { setAnalyticsTab('budget'); setSelectedRowId(null); }}
              className={`px-3 py-1.5 rounded transition-all ${analyticsTab === 'budget' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface'}`}
            >
              Budgets
            </button>
            <button 
              onClick={() => { setAnalyticsTab('pensions'); setSelectedRowId(null); }}
              className={`px-3 py-1.5 rounded transition-all ${analyticsTab === 'pensions' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface'}`}
            >
              Pensions
            </button>
            <button 
              onClick={() => { setAnalyticsTab('incentives'); setSelectedRowId(null); }}
              className={`px-3 py-1.5 rounded transition-all ${analyticsTab === 'incentives' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface'}`}
            >
              Carbon Payouts
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setPresentationMode(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-outline hover:bg-surface-container text-on-surface font-bold text-xs rounded uppercase tracking-wider transition-colors"
            title="Full screen cast mode"
          >
            <span className="material-symbols-outlined text-[16px]">tv</span>
            Presentation
          </button>
          <button 
            onClick={triggerMockCSVExport}
            className="flex items-center gap-1.5 px-4 py-2 border border-outline hover:bg-surface-container text-on-surface font-bold text-xs rounded uppercase tracking-wider transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export CSV
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print Report
          </button>
        </div>
      </section>

      {/* Content panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Row 1: The Interactive SVG Chart */}
        <div className="bg-white border border-outline-variant p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant/60">
            <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">
              {analyticsTab === 'schemes' && 'Scheme Completion rates & Budgets'}
              {analyticsTab === 'budget' && 'Waterfall Department allocations'}
              {analyticsTab === 'pensions' && 'Village Pension distributions'}
              {analyticsTab === 'incentives' && 'Verified carbon credit incentive levels'}
            </span>
            <span className="text-[10px] bg-secondary-container text-on-secondary-container font-mono px-2 py-0.5 rounded font-bold">
              CROSS-FILTER CHANNELS ACTIVE
            </span>
          </div>

          <div className="h-56 w-full flex items-end justify-between px-6 pt-4 relative">
            
            {/* Visual Charts: Scheme Bar Chart */}
            {analyticsTab === 'schemes' && getSortedData(schemeMetrics).map(scheme => {
              const isSelected = selectedRowId === scheme.id;
              return (
                <div 
                  key={scheme.id}
                  onClick={() => setSelectedRowId(isSelected ? null : scheme.id)}
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer group h-full justify-end"
                >
                  <div className="text-[10px] font-mono-data font-bold text-on-surface">{scheme.completionPct}%</div>
                  
                  {/* Two comparative bars */}
                  <div className="w-16 flex gap-1 items-end h-32 justify-center">
                    <div 
                      className={`w-6 rounded-t-sm transition-all duration-300 ${
                        isSelected ? 'bg-primary' : 'bg-primary-container group-hover:bg-primary'
                      }`}
                      style={{ height: `${(scheme.budgetAllocatedCr / 120) * 100}px` }}
                      title={`Allocated: ₹${scheme.budgetAllocatedCr} Cr`}
                    />
                    <div 
                      className={`w-6 rounded-t-sm transition-all duration-300 ${
                        isSelected ? 'bg-secondary' : 'bg-secondary/40 group-hover:bg-secondary'
                      }`}
                      style={{ height: `${(scheme.budgetSpentCr / 120) * 100}px` }}
                      title={`Spent: ₹${scheme.budgetSpentCr} Cr`}
                    />
                  </div>
                  
                  <span className="text-[9px] font-bold text-on-surface-variant text-center leading-tight truncate max-w-[120px]">
                    {scheme.name.replace('MP ', '').replace('Initiative ', '')}
                  </span>
                </div>
              );
            })}

            {/* Visual Charts: Budget Waterfall Chart */}
            {analyticsTab === 'budget' && getSortedData(budgetMetrics).map(bdg => {
              const isSelected = selectedRowId === bdg.id;
              return (
                <div 
                  key={bdg.id}
                  onClick={() => setSelectedRowId(isSelected ? null : bdg.id)}
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer group h-full justify-end"
                >
                  <div className="text-[10px] font-mono-data font-bold text-on-surface">₹{bdg.utilizedInrCr} Cr</div>
                  
                  {/* Waterfall bar blocks stacked */}
                  <div className="w-12 bg-surface-container rounded-sm overflow-hidden h-36 flex flex-col justify-end border border-outline-variant/40">
                    <div 
                      className={`bg-error transition-all duration-300`} 
                      style={{ height: `${(bdg.commitedInrCr / bdg.allocatedInrCr) * 100}%` }}
                      title={`Committed: ₹${bdg.commitedInrCr} Cr`}
                    />
                    <div 
                      className={`transition-all duration-300 ${isSelected ? 'bg-primary' : 'bg-primary/60'}`} 
                      style={{ height: `${(bdg.utilizedInrCr / bdg.allocatedInrCr) * 100}%` }}
                      title={`Utilized: ₹${bdg.utilizedInrCr} Cr`}
                    />
                  </div>
                  
                  <span className="text-[9px] font-bold text-on-surface-variant text-center max-w-[100px] truncate">
                    {bdg.department.replace(' Department', '').replace(' board', '')}
                  </span>
                </div>
              );
            })}

            {/* Visual Charts: Pension Area Line chart */}
            {analyticsTab === 'pensions' && (
              <div className="w-full h-full flex flex-col justify-between">
                <svg className="w-full h-40" viewBox="0 0 400 100">
                  <path
                    d={`M 10 90 L 130 60 L 250 40 L 370 70`}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3"
                  />
                  {/* Area fill */}
                  <path
                    d={`M 10 90 L 130 60 L 250 40 L 370 70 L 370 100 L 10 100 Z`}
                    fill="rgba(59, 130, 246, 0.08)"
                  />
                  {/* Nodes */}
                  {[
                    { x: 10, y: 90, val: '₹42.6L', label: 'Kshipra', id: 'PEN-01' },
                    { x: 130, y: 60, val: '₹56.7L', label: 'Mhow', id: 'PEN-02' },
                    { x: 250, y: 40, val: '₹68.2L', label: 'Misrod', id: 'PEN-03' },
                    { x: 370, y: 70, val: '₹24.5L', label: 'Pithampur', id: 'PEN-04' }
                  ].map((nd, idx) => {
                    const isSelected = selectedRowId === nd.id;
                    return (
                      <g 
                        key={idx} 
                        className="cursor-pointer"
                        onClick={() => setSelectedRowId(isSelected ? null : nd.id)}
                      >
                        <circle 
                          cx={nd.x} 
                          cy={nd.y} 
                          r={isSelected ? 6 : 4} 
                          fill={isSelected ? '#3B82F6' : '#FFFFFF'} 
                          stroke="#3B82F6" 
                          strokeWidth="2"
                        />
                        <text x={nd.x} y={nd.y - 8} fontSize="6" fontWeight="bold" textAnchor="middle" fill="#333">
                          {nd.val}
                        </text>
                        <text x={nd.x} y="98" fontSize="6" fill="#888" textAnchor="middle">
                          {nd.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* Visual Charts: Carbon payout Radar segments */}
            {analyticsTab === 'incentives' && getSortedData(carbonIncentives).map(carb => {
              const isSelected = selectedRowId === carb.id;
              return (
                <div 
                  key={carb.id}
                  onClick={() => setSelectedRowId(isSelected ? null : carb.id)}
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer group h-full justify-end"
                >
                  <div className="text-[10px] font-mono-data font-bold text-on-surface">{carb.creditsVerifiedKt} Kt</div>
                  
                  {/* Radial height indicator block */}
                  <div 
                    className={`w-16 rounded-full border-4 transition-all duration-300 ${
                      isSelected ? 'bg-tertiary border-tertiary' : 'bg-tertiary-container/30 border-tertiary-container/60 hover:bg-tertiary-container/50'
                    }`}
                    style={{ height: `${(carb.incentivePaidInrLakhs / 30) * 120}px` }}
                    title={`Paid: ₹${carb.incentivePaidInrLakhs} L`}
                  />
                  
                  <span className="text-[9px] font-bold text-on-surface-variant text-center truncate max-w-[100px]">
                    {carb.villageName}
                  </span>
                </div>
              );
            })}

          </div>
        </div>

        {/* Row 2: Enterprise Data Table with Paginated sorting columns */}
        <div className="bg-white border border-outline-variant rounded-lg shadow-sm overflow-hidden">
          
          {/* Table wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-bold uppercase select-none">
                  
                  {/* Headers depending on tab */}
                  {analyticsTab === 'schemes' && (
                    <>
                      <th onClick={() => handleSort('id')} className="py-3 px-4 cursor-pointer hover:text-primary">ID <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('name')} className="py-3 px-4 cursor-pointer hover:text-primary">Scheme Title <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('budgetAllocatedCr')} className="py-3 px-4 cursor-pointer hover:text-primary">Budget Allocated <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('budgetSpentCr')} className="py-3 px-4 cursor-pointer hover:text-primary">Budget Spent <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('activeBeneficiaries')} className="py-3 px-4 cursor-pointer hover:text-primary">Beneficiaries <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('completionPct')} className="py-3 px-4 cursor-pointer hover:text-primary">Completion % <span className="text-[10px]">↕</span></th>
                    </>
                  )}

                  {analyticsTab === 'budget' && (
                    <>
                      <th onClick={() => handleSort('id')} className="py-3 px-4 cursor-pointer hover:text-primary">ID <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('department')} className="py-3 px-4 cursor-pointer hover:text-primary">Board / Department <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('allocatedInrCr')} className="py-3 px-4 cursor-pointer hover:text-primary">Allocated Fund <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('utilizedInrCr')} className="py-3 px-4 cursor-pointer hover:text-primary">Utilized Fund <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('commitedInrCr')} className="py-3 px-4 cursor-pointer hover:text-primary">Committed Fund <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('auditStatus')} className="py-3 px-4 cursor-pointer hover:text-primary">Audit Track <span className="text-[10px]">↕</span></th>
                    </>
                  )}

                  {analyticsTab === 'pensions' && (
                    <>
                      <th onClick={() => handleSort('id')} className="py-3 px-4 cursor-pointer hover:text-primary">ID <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('villageName')} className="py-3 px-4 cursor-pointer hover:text-primary">Village <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('eligibleFarmers')} className="py-3 px-4 cursor-pointer hover:text-primary">Eligible Farmers <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('distributedInrLakhs')} className="py-3 px-4 cursor-pointer hover:text-primary">Distributed Fund <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('pendingClaims')} className="py-3 px-4 cursor-pointer hover:text-primary">Pending Claims <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('complianceRate')} className="py-3 px-4 cursor-pointer hover:text-primary">Compliance Rate <span className="text-[10px]">↕</span></th>
                    </>
                  )}

                  {analyticsTab === 'incentives' && (
                    <>
                      <th onClick={() => handleSort('id')} className="py-3 px-4 cursor-pointer hover:text-primary">ID <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('villageName')} className="py-3 px-4 cursor-pointer hover:text-primary">Village <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('creditsVerifiedKt')} className="py-3 px-4 cursor-pointer hover:text-primary">Verified Credits <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('incentivePaidInrLakhs')} className="py-3 px-4 cursor-pointer hover:text-primary">Paid Incentives <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('verificationAgency')} className="py-3 px-4 cursor-pointer hover:text-primary">Auditing Agency <span className="text-[10px]">↕</span></th>
                      <th onClick={() => handleSort('payoutStatus')} className="py-3 px-4 cursor-pointer hover:text-primary">Payout Status <span className="text-[10px]">↕</span></th>
                    </>
                  )}

                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 font-medium">
                
                {/* Schemes list rows */}
                {analyticsTab === 'schemes' && getSortedData(schemeMetrics).map(s => {
                  const isSelected = selectedRowId === s.id;
                  return (
                    <tr 
                      key={s.id}
                      onClick={() => setSelectedRowId(isSelected ? null : s.id)}
                      className={`cursor-pointer transition-colors hover:bg-surface-container-low ${
                        isSelected ? 'bg-primary-container/30 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold">{s.id}</td>
                      <td className="py-3 px-4 font-semibold">{s.name}</td>
                      <td className="py-3 px-4 font-mono-data">₹{s.budgetAllocatedCr} Cr</td>
                      <td className="py-3 px-4 font-mono-data">₹{s.budgetSpentCr} Cr</td>
                      <td className="py-3 px-4 font-mono-data">{s.activeBeneficiaries.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-data">{s.completionPct}%</span>
                          <div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${s.completionPct}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Budgets list rows */}
                {analyticsTab === 'budget' && getSortedData(budgetMetrics).map(b => {
                  const isSelected = selectedRowId === b.id;
                  return (
                    <tr 
                      key={b.id}
                      onClick={() => setSelectedRowId(isSelected ? null : b.id)}
                      className={`cursor-pointer transition-colors hover:bg-surface-container-low ${
                        isSelected ? 'bg-primary-container/30 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold">{b.id}</td>
                      <td className="py-3 px-4 font-semibold">{b.department}</td>
                      <td className="py-3 px-4 font-mono-data">₹{b.allocatedInrCr} Cr</td>
                      <td className="py-3 px-4 font-mono-data">₹{b.utilizedInrCr} Cr</td>
                      <td className="py-3 px-4 font-mono-data">₹{b.commitedInrCr} Cr</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] border ${
                          b.auditStatus === 'AUDITED' ? 'bg-primary-container text-primary border-primary/20' : 'bg-yellow-50 text-yellow-800 border-yellow-300'
                        }`}>
                          {b.auditStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* Pensions list rows */}
                {analyticsTab === 'pensions' && getSortedData(pensionDistributions).map(p => {
                  const isSelected = selectedRowId === p.id;
                  return (
                    <tr 
                      key={p.id}
                      onClick={() => setSelectedRowId(isSelected ? null : p.id)}
                      className={`cursor-pointer transition-colors hover:bg-surface-container-low ${
                        isSelected ? 'bg-primary-container/30 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold">{p.id}</td>
                      <td className="py-3 px-4 font-semibold">{p.villageName}</td>
                      <td className="py-3 px-4 font-mono-data">{p.eligibleFarmers.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono-data">₹{p.distributedInrLakhs} L</td>
                      <td className="py-3 px-4 font-mono-data">{p.pendingClaims}</td>
                      <td className="py-3 px-4 font-mono-data">{p.complianceRate}%</td>
                    </tr>
                  );
                })}

                {/* Carbon incentives list rows */}
                {analyticsTab === 'incentives' && getSortedData(carbonIncentives).map(c => {
                  const isSelected = selectedRowId === c.id;
                  return (
                    <tr 
                      key={c.id}
                      onClick={() => setSelectedRowId(isSelected ? null : c.id)}
                      className={`cursor-pointer transition-colors hover:bg-surface-container-low ${
                        isSelected ? 'bg-primary-container/30 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold">{c.id}</td>
                      <td className="py-3 px-4 font-semibold">{c.villageName}</td>
                      <td className="py-3 px-4 font-mono-data">{c.creditsVerifiedKt} Kt</td>
                      <td className="py-3 px-4 font-mono-data">₹{c.incentivePaidInrLakhs} L</td>
                      <td className="py-3 px-4">{c.verificationAgency}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] border ${
                          c.payoutStatus === 'PAID' ? 'bg-primary-container text-primary border-primary/20' : 'bg-yellow-50 text-yellow-800 border-yellow-300'
                        }`}>
                          {c.payoutStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SchemesGrants;
