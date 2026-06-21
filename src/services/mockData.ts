import type { Officer, Incident, KpiMetric } from '../types';

export const mockOfficers: Officer[] = [
  {
    id: '44201-B',
    name: 'Arjun K. Sharma',
    designation: 'Chief Forest Conservator',
    district: 'Garhwal North',
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
    id: '44205-C',
    name: 'Priya Deshmukh',
    designation: 'District Officer',
    district: 'Ratnagiri West',
    activeAssignments: ['HY'],
    perfScore: 88,
    status: 'ACTIVE',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6uMievXmfF56zyOvZCw19hGn58S76P2TrRtZVRi1O1VAq6HHExcCdp5wBEK7pLsYk_NVkreXvW3jVQ99q-FcD_j56x5DchVdo_cYzIgCrM0q9XOT-_MDuGSNNgN12OqL77FVErPUhZCSrm_hQd0kCaSnvyv2TFwN8z8iKHZU2UVWrvghIVcdIKceeD4uTtO001nYI2NBBtOsFhggzIe56YNDnFR0tMhmnPXQ-EHzS5w2eV2-8-tJJU0NqVNN7vGyyuIlLR7c_szM',
    experienceYears: 6,
    reportsSubmitted: 482,
    lastActivityLocation: 'Ratnagiri Coast Sector A',
    lastActivityTime: '1h ago'
  },
  {
    id: '44302-A',
    name: 'Vikram Singh',
    designation: 'Senior Hydrologist',
    district: 'Indore South',
    activeAssignments: ['WF', 'EM'],
    perfScore: 91,
    status: 'ON-FIELD',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe5O0iitiVyt09EIEqX9Nl_cUCG8gs6V-7eqPIdIdb16RZRVxf4cxMnaAwQtq4zK3RQUmocJ7XhCo0Um5n8HKFiNTpWlMnymja_di-mLm14rHOYMkwRV-oNJlt4fjLxQwQRvOkZ1qkbTmYX8uXbpNWsWIZUpWvf2TdCmfpYcxb5_PkOu6Km7nRHuDAG6qvIlKkdqLyOwb1eRbDhfPHv8AS0G7y9B_EPCiArIUsOuQbgwohU24iVtG4V1rCDAgjAjMdo1GDW35QdJQ',
    experienceYears: 11,
    reportsSubmitted: 893,
    lastActivityLocation: 'Narmada River Sensor Node 3',
    lastActivityTime: '3h ago'
  },
  {
    id: '44211-D',
    name: 'Ananya Roy',
    designation: 'Forestry Analyst',
    district: 'Sundarbans Central',
    activeAssignments: ['FR'],
    perfScore: 97,
    status: 'ACTIVE',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0FS3A664wVPsAYD3BMLQkrr-9fqnx2Nrnme4_tq-zXlBdkHTu0bIUBX7Lg-tN6UxBASWl9TjkW66_F1esPTf3QnqSibu_waj0XuFcsBI1gSmF9Mf5PG8fw-mybTbfxxVJu8qQUnWL_BGEmnxWWXkRKX5Zzar-Jwayo6BoW39WPedw5Tb4u1NCTRjL4x94_21jjXfpkVZsoLkU4J0BSDXtblJd0_ZhO7oxgSHtyvs_liN_YbFu9wpLsErceNMT9KBIb7H1Ng-F_KE',
    experienceYears: 4,
    reportsSubmitted: 312,
    lastActivityLocation: 'Sajnekhali Beat House',
    lastActivityTime: '5m ago'
  }
];

export const mockIncidents: Incident[] = [
  {
    id: 'M-ID: 44921-X',
    code: '44921-X',
    severity: 'CRITICAL',
    time: '14:22:05 UTC',
    title: 'Uncontrolled Forest Blaze',
    description: 'Perimeter breach detected in Western Ghats Region, Sector 7-G. High-velocity winds pushing towards residential clusters.',
    location: 'Kerala (Palakkad)',
    district: 'Palakkad',
    coordinates: '10.7816° N, 76.6548° E',
    temperature: '482°C (Core)',
    coreTemp: '482°C',
    flowRate: 'N/A',
    threatRadius: '12.5 km',
    windVelocity: '14.2 km/h SSE',
    humidity: '62%',
    teamDeployed: 'Fire Unit Alpha-2, Water Tanker X-11'
  },
  {
    id: 'M-ID: 44922-A',
    code: '44922-A',
    severity: 'WARNING',
    time: '13:45:12 UTC',
    title: 'Sudden Water Level Spike',
    description: 'Sensor #R-21 (River Narmada) reports 2.4m rise in 30 minutes. Potential flash flood warning for downstream tributaries.',
    location: 'Madhya Pradesh',
    district: 'Indore',
    coordinates: '22.7196° N, 75.8577° E',
    flowRate: '+12%',
    temperature: '28°C',
    threatRadius: '5.0 km',
    windVelocity: '8.4 km/h W',
    humidity: '78%',
    teamDeployed: 'Hydrology Team Delta'
  },
  {
    id: 'M-ID: 44919-C',
    code: '44919-C',
    severity: 'RESPONDED',
    time: '10:15:30 UTC',
    title: 'Industrial Emission Breach',
    description: 'AQI Sensor in Okhla Zone detected excessive SO2 levels. Field team dispatched for inspection.',
    location: 'New Delhi (South)',
    district: 'Okhla',
    coordinates: '28.5355° N, 77.2639° E',
    flowRate: 'SO2 Level: 450 ppb',
    temperature: '38°C',
    threatRadius: '2.0 km',
    windVelocity: '5.0 km/h NW',
    humidity: '40%',
    teamDeployed: 'Delta-9'
  },
  {
    id: 'M-ID: 44910-Z',
    code: '44910-Z',
    severity: 'RESOLVED',
    time: '08:00:00 UTC',
    title: 'Coastal Erosion Alert',
    description: 'Coastal erosion alert in Odisha. Automated closure after telemetry signal stabilized.',
    location: 'Odisha (Puri)',
    district: 'Puri',
    coordinates: '19.8134° N, 85.8312° E',
    threatRadius: '1.5 km',
    teamDeployed: 'None'
  }
];

export const mockDashboardKpis: KpiMetric[] = [
  {
    id: 'sustainability',
    title: 'NATIONAL SUSTAINABILITY',
    value: '78.4',
    trend: '+1.2% from prev. quarter',
    trendDirection: 'up',
    label: 'NATIONAL SUSTAINABILITY'
  },
  {
    id: 'fires',
    title: 'ACTIVE FOREST FIRES',
    value: '12',
    trend: 'High Risk: Odisha, MH',
    trendDirection: 'down',
    label: 'ACTIVE FOREST FIRES',
    color: 'error'
  },
  {
    id: 'water',
    title: 'WATER TABLE STATUS',
    value: 'Critical',
    trend: 'Aggregated depth: -12.4m avg',
    trendDirection: 'down',
    progress: 35,
    label: 'WATER TABLE STATUS',
    color: 'secondary'
  }
];

export const mockAnalysisKpis: KpiMetric[] = [
  {
    id: 'aqi',
    title: 'AQI AVERAGE',
    value: '142.4',
    trend: '↑ 12%',
    trendDirection: 'down',
    label: 'AQI AVERAGE',
    sparklineValues: [40, 60, 50, 80, 95, 90],
    color: 'error'
  },
  {
    id: 'forest',
    title: 'FOREST COVER',
    value: '21.7%',
    trend: '↑ 2.4%',
    trendDirection: 'up',
    label: 'FOREST COVER',
    sparklineValues: [20, 30, 35, 45, 55, 60],
    color: 'primary'
  },
  {
    id: 'carbon',
    title: 'CARBON OFFSET',
    value: '842 kT',
    trend: '↑ 18%',
    trendDirection: 'up',
    label: 'CARBON OFFSET',
    sparklineValues: [50, 55, 60, 75, 85, 90],
    color: 'secondary'
  },
  {
    id: 'renewable',
    title: 'RENEWABLE MIX',
    value: '34.1%',
    trend: 'STABLE',
    trendDirection: 'stable',
    label: 'RENEWABLE MIX',
    progress: 34,
    color: 'secondary'
  }
];

export const mockDistrictPerformance = [
  { district: 'Wayanad', state: 'Kerala', aqi: '42 (Good)', forestCover: '74.2%', waterIndex: '0.88', compliance: 'OPTIMAL' },
  { district: 'Chandrapur', state: 'Maharashtra', aqi: '182 (Poor)', forestCover: '35.1%', waterIndex: '0.42', compliance: 'WARNING' },
  { district: 'Sundargarh', state: 'Odisha', aqi: '94 (Fair)', forestCover: '52.8%', waterIndex: '0.61', compliance: 'NEUTRAL' },
  { district: 'Bhiwani', state: 'Haryana', aqi: '210 (V. Poor)', forestCover: '3.4%', waterIndex: '0.18', compliance: 'CRITICAL' },
  { district: 'Idukki', state: 'Kerala', aqi: '38 (Good)', forestCover: '71.5%', waterIndex: '0.92', compliance: 'OPTIMAL' }
];

export const mockCarbonFootprint = [
  { name: 'Manufacturing', value: 42, color: 'bg-primary' },
  { name: 'Energy', value: 18, color: 'bg-primary-container' },
  { name: 'Transport', value: 12, color: 'bg-secondary' },
  { name: 'Agri', value: 8, color: 'bg-secondary-container' },
  { name: 'Other', value: 20, color: 'bg-surface-container-highest' }
];
