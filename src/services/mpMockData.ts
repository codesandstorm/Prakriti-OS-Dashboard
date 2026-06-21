import type { Officer, Incident } from '../types';

export interface Village {
  id: string;
  name: string;
  district: string;
  population: number;
  aqiScore: number;
  waterLevelDepth: number; // in meters
  forestCoverPct: number;
  complianceState: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
}

export interface Scheme {
  id: string;
  name: string;
  beneficiariesCount: number;
  budgetAllocatedCr: number;
  completionPct: number;
  sector: 'Forestry' | 'Water' | 'Air' | 'Waste Management';
}

export interface EnvAsset {
  id: string;
  name: string;
  category: 'River' | 'Forest Reserve' | 'Wetland' | 'Sanctuary';
  district: string;
  status: 'Healthy' | 'Degraded' | 'Critical';
  healthScore: number;
}

export const mpDistricts = [
  'Indore',
  'Bhopal',
  'Jabalpur',
  'Gwalior',
  'Ujjain',
  'Sagar',
  'Rewa',
  'Dhar',
  'Khargone',
  'Dewas',
  'Sehore',
  'Hoshangabad'
];

export const mpVillages: Village[] = [
  { id: 'VIL-001', name: 'Kshipra', district: 'Indore', population: 2450, aqiScore: 68, waterLevelDepth: 14.5, forestCoverPct: 24.2, complianceState: 'OPTIMAL' },
  { id: 'VIL-002', name: 'Mhow Village', district: 'Indore', population: 3100, aqiScore: 84, waterLevelDepth: 18.2, forestCoverPct: 18.5, complianceState: 'OPTIMAL' },
  { id: 'VIL-003', name: 'Misrod', district: 'Bhopal', population: 4200, aqiScore: 145, waterLevelDepth: 22.8, forestCoverPct: 12.1, complianceState: 'WARNING' },
  { id: 'VIL-004', name: 'Phanda', district: 'Bhopal', population: 1800, aqiScore: 92, waterLevelDepth: 15.1, forestCoverPct: 34.0, complianceState: 'OPTIMAL' },
  { id: 'VIL-005', name: 'Pithampur Rural', district: 'Dhar', population: 5300, aqiScore: 240, waterLevelDepth: 29.4, forestCoverPct: 6.4, complianceState: 'CRITICAL' },
  { id: 'VIL-006', name: 'Sardarpur', district: 'Dhar', population: 2900, aqiScore: 55, waterLevelDepth: 11.2, forestCoverPct: 42.8, complianceState: 'OPTIMAL' },
  { id: 'VIL-007', name: 'Budhni', district: 'Sehore', population: 3400, aqiScore: 78, waterLevelDepth: 9.8, forestCoverPct: 56.4, complianceState: 'OPTIMAL' },
  { id: 'VIL-008', name: 'Pipariya Rural', district: 'Hoshangabad', population: 2150, aqiScore: 42, waterLevelDepth: 8.5, forestCoverPct: 68.2, complianceState: 'OPTIMAL' }
];

export const mpSchemes: Scheme[] = [
  { id: 'SCH-MP01', name: 'MP Green Canopy Mission', beneficiariesCount: 145000, budgetAllocatedCr: 45.5, completionPct: 78, sector: 'Forestry' },
  { id: 'SCH-MP02', name: 'Integrated Narmada Basin Conservation', beneficiariesCount: 890000, budgetAllocatedCr: 120.0, completionPct: 62, sector: 'Water' },
  { id: 'SCH-MP03', name: 'Soil Health Index Tracker', beneficiariesCount: 320000, budgetAllocatedCr: 15.8, completionPct: 92, sector: 'Water' },
  { id: 'SCH-MP04', name: 'Clean Air Initiative Indore', beneficiariesCount: 2200000, budgetAllocatedCr: 80.0, completionPct: 40, sector: 'Air' }
];

export const mpEnvAssets: EnvAsset[] = [
  { id: 'AST-001', name: 'Narmada River Segment A', category: 'River', district: 'Hoshangabad', status: 'Healthy', healthScore: 92 },
  { id: 'AST-002', name: 'Satpura Reserve Forestry Sector 4', category: 'Forest Reserve', district: 'Hoshangabad', status: 'Healthy', healthScore: 88 },
  { id: 'AST-003', name: 'Chambal River Sanctuary Checkpoint', category: 'Sanctuary', district: 'Gwalior', status: 'Degraded', healthScore: 54 },
  { id: 'AST-004', name: 'Mandu Wetland Catchment', category: 'Wetland', district: 'Dhar', status: 'Critical', healthScore: 32 }
];

export const mpOfficers: Officer[] = [
  {
    id: 'MP-OFF-401',
    name: 'Arjun K. Sharma',
    designation: 'Chief Forest Conservator',
    district: 'Indore',
    activeAssignments: ['AQ', 'FR'],
    perfScore: 94,
    status: 'ON-FIELD',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGK3aVFBMF5tB6PF_vX9o5YT7I4Z3WOGklP_Rj2mnIFnLsSHcj0ZdLkYmhbEUTEu4EXU-ff38y6gfOtshYM_NYxBPT5k9vsIR9PsmazQDwui6zkpyPYAJnbxpbvbtlAXqRn89v54V1zDJrxwHBaGpXgWwxjtMVJ7jXbuj64sRisHleXYKZ2BO7YRvVrSrZPjyObjlLbW3WVA1yadwMuLkGJmzzu96GvFpxS1Wej7asA7sTV18x5UGTXKtlKzpwxBU26xZQSgtQQIY',
    experienceYears: 14,
    reportsSubmitted: 1248,
    lastActivityLocation: 'Sector 4B, Upper Garhwal Ridge',
    lastActivityTime: '24m ago',
    lastActivityMapUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA25j3xbptbqUmnxDB5NQHXf3t0XO-uw1iSw7266E6pVLZB8qNsgA-5f3qb4GgtK9w7oMp5-dW2hIIlPcaxTOH9Sze8046WcX_L3iwQP4bH-hCndKHMSkW-YY5GmS6Eg20Y174bdbtNa4XfD_8cw844IxxFJbVNWZu0cBGGNEiLD3cBndFq3lP1OJlk5seT97K3Wh4UlIB--85bBAS2JD7i8aUhA94I1n8EjVTBfN1nk6JkiZQso12KATq9cDkh2dR2kDjtDI3sjZM'
  },
  {
    id: 'MP-OFF-402',
    name: 'Priya Deshmukh',
    designation: 'District Inspector',
    district: 'Bhopal',
    activeAssignments: ['HY', 'AQ'],
    perfScore: 88,
    status: 'ACTIVE',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6uMievXmfF56zyOvZCw19hGn58S76P2TrRtZVRi1O1VAq6HHExcCdp5wBEK7pLsYk_NVkreXvW3jVQ99q-FcD_j56x5DchVdo_cYzIgCrM0q9XOT-_MDuGSNNgN12OqL77FVErPUhZCSrm_hQd0kCaSnvyv2TFwN8z8iKHZU2UVWrvghIVcdIKceeD4uTtO001nYI2NBBtOsFhggzIe56YNDnFR0tMhmnPXQ-EHzS5w2eV2-8-tJJU0NqVNN7vGyyuIlLR7c_szM',
    experienceYears: 6,
    reportsSubmitted: 482,
    lastActivityLocation: 'Bhopal Industrial Sector C',
    lastActivityTime: '1h ago'
  },
  {
    id: 'MP-OFF-403',
    name: 'Vikram Singh',
    designation: 'Senior Hydrologist',
    district: 'Hoshangabad',
    activeAssignments: ['HY', 'EM'],
    perfScore: 91,
    status: 'ON-FIELD',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe5O0iitiVyt09EIEqX9Nl_cUCG8gs6V-7eqPIdIdb16RZRVxf4cxMnaAwQtq4zK3RQUmocJ7XhCo0Um5n8HKFiNTpWlMnymja_di-mLm14rHOYMkwRV-oNJlt4fjLxQwQRvOkZ1qkbTmYX8uXbpNWsWIZUpWvf2TdCmfpYcxb5_PkOu6Km7nRHuDAG6qvIlKkdqLyOwb1eRbDhfPHv8AS0G7y9B_EPCiArIUsOuQbgwohU24iVtG4V1rCDAgjAjMdo1GDW35QdJQ',
    experienceYears: 11,
    reportsSubmitted: 893,
    lastActivityLocation: 'Narmada River Sensor Node 3',
    lastActivityTime: '3h ago'
  },
  {
    id: 'MP-OFF-404',
    name: 'Ananya Roy',
    designation: 'Wildlife Analyst',
    district: 'Hoshangabad',
    activeAssignments: ['FR'],
    perfScore: 97,
    status: 'ACTIVE',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FS3A664wVPsAYD3BMLQkrr-9fqnx2Nrnme4_tq-zXlBdkHTu0bIUBX7Lg-tN6UxBASWl9TjkW66_F1esPTf3QnqSibu_waj0XuFcsBI1gSmF9Mf5PG8fw-mybTbfxxVJu8qQUnWL_BGEmnxWWXkRKX5Zzar-Jwayo6BoW39WPedw5Tb4u1NCTRjL4x94_21jjXfpkVZsoLkU4J0BSDXtblJd0_ZhO7oxgSHtyvs_liN_YbFu9wpLsErceNMT9KBIb7H1Ng-F_KE',
    experienceYears: 4,
    reportsSubmitted: 312,
    lastActivityLocation: 'Satpura Tiger Sanctuary Post 2',
    lastActivityTime: '5m ago'
  }
];

export const mpIncidents: Incident[] = [
  {
    id: 'INC-MP-201',
    code: '7H-4',
    severity: 'CRITICAL',
    time: '02:45 AM',
    title: 'ILLEGAL LOGGING DETECTED',
    description: 'Grid Sector 7H-4, Silent Valley. Thermal signatures detected at 02:45 AM.',
    location: 'Satpura Forest Sector C',
    district: 'Hoshangabad',
    coordinates: '22.4678° N, 77.8921° E',
    temperature: '180°C (Core)',
    threatRadius: '2.5 km',
    windVelocity: '12.4 km/h S',
    humidity: '52%',
    teamDeployed: 'Forest Guard Patrol Unit 3'
  },
  {
    id: 'INC-MP-202',
    code: 'G-412',
    severity: 'RESPONDED',
    time: '1 hour ago',
    title: 'WATER LEVEL ANOMALY',
    description: 'Ganga/Narmada basin sensor #412 reporting 15% drop below seasonal baseline.',
    location: 'Narmada River Segment 3',
    district: 'Hoshangabad',
    coordinates: '22.7534° N, 77.7265° E',
    flowRate: '1240 cusec (-15%)',
    threatRadius: '1.2 km',
    teamDeployed: 'Hydrological Survey Team B'
  },
  {
    id: 'INC-MP-203',
    code: 'AQ-901',
    severity: 'CRITICAL',
    time: '3 hours ago',
    title: 'AQI THRESHOLD EXCEEDED',
    description: 'Gurugram/Pithampur Central monitoring station reports PM10 at 450 (Hazardous).',
    location: 'Pithampur Industrial Area',
    district: 'Dhar',
    coordinates: '22.6120° N, 75.6811° E',
    flowRate: 'PM10: 450 µg/m³',
    threatRadius: '6.0 km',
    teamDeployed: 'Environment Mitigation Unit 1'
  }
];

export const mockDistrictPerformance = [
  { district: 'Indore', state: 'Madhya Pradesh', aqi: '142 (Fair)', forestCover: '16.2%', waterIndex: '0.68', compliance: 'OPTIMAL' },
  { district: 'Bhopal', state: 'Madhya Pradesh', aqi: '124 (Fair)', forestCover: '22.4%', waterIndex: '0.72', compliance: 'OPTIMAL' },
  { district: 'Jabalpur', state: 'Madhya Pradesh', aqi: '88 (Good)', forestCover: '31.5%', waterIndex: '0.85', compliance: 'OPTIMAL' },
  { district: 'Gwalior', state: 'Madhya Pradesh', aqi: '194 (Poor)', forestCover: '18.1%', waterIndex: '0.54', compliance: 'WARNING' },
  { district: 'Ujjain', state: 'Madhya Pradesh', aqi: '98 (Good)', forestCover: '12.8%', waterIndex: '0.61', compliance: 'NEUTRAL' },
  { district: 'Dhar', state: 'Madhya Pradesh', aqi: '240 (V. Poor)', forestCover: '6.4%', waterIndex: '0.32', compliance: 'CRITICAL' }
];
