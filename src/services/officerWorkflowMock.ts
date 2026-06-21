export interface OfficerTask {
  id: string;
  officerId: string;
  title: string;
  category: 'AQI' | 'Soil' | 'Forestry' | 'Water';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED';
  dateAssigned: string;
  details: string;
}

export interface AuditTrailLog {
  id: string;
  timestamp: string;
  officerId: string;
  action: string;
  details: string;
}

export const initialOfficerTasks: OfficerTask[] = [
  {
    id: 'TSK-101',
    officerId: 'MP-OFF-401', // Arjun Sharma
    title: 'Audit Satpura Forest illegal canopy clearing reports',
    category: 'Forestry',
    status: 'PENDING',
    dateAssigned: '2026-06-18',
    details: 'Verify thermal anomalies detected by INSAT satellites in Sector C-2.'
  },
  {
    id: 'TSK-102',
    officerId: 'MP-OFF-401', // Arjun Sharma
    title: 'Pithampur Smog Tower inspection',
    category: 'AQI',
    status: 'APPROVED',
    dateAssigned: '2026-06-12',
    details: 'Calibrate particulates sensor grid. Verified: optimal performance.'
  },
  {
    id: 'TSK-201',
    officerId: 'MP-OFF-402', // Priya Deshmukh
    title: 'Bhopal sector water table check',
    category: 'Water',
    status: 'PENDING',
    dateAssigned: '2026-06-19',
    details: 'Examine drawdown trends at industrial borewell sector A.'
  }
];

export const initialAuditLogs: AuditTrailLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-06-18 10:30',
    officerId: 'MP-OFF-401',
    action: 'Task Assigned',
    details: 'Collector assigned: Audit Satpura Forest canopy reports.'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-06-12 14:15',
    officerId: 'MP-OFF-401',
    action: 'Status Approved',
    details: 'Collector approved Pithampur Smog Tower inspection results.'
  }
];
