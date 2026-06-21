export interface ScoreTrend {
  year: number;
  score: number;
  groundwaterDepth: number;
  canopyPct: number;
}

export interface EnvironmentalPassport {
  prakritiScore: number;
  airQualityIndex: number;
  groundwaterIndex: number; // 0-100
  soilHealthIndex: number;   // 0-100
  forestCoverPct: number;
  carbonCreditsOffsetKt: number;
}

export interface AIRecommendation {
  id: string;
  category: 'water' | 'soil' | 'forestry' | 'air';
  title: string;
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  difficulty: 'EASY' | 'MODERATE' | 'COMPLEX';
}

export interface RiskFactor {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'STABLE';
  description: string;
}

export interface VillageProfile {
  id: string;
  name: string;
  district: string;
  block: string;
  rankInBlock: number;
  totalVillagesInBlock: number;
  achievements: string[];
  passport: EnvironmentalPassport;
  history: ScoreTrend[];
  recommendations: AIRecommendation[];
  risks: RiskFactor[];
  officerNotes: { date: string; officer: string; comment: string }[];
  inspections: { id: string; date: string; category: string; status: string; inspector: string }[];
}

export const villageProfiles: Record<string, VillageProfile> = {
  'VIL-001': {
    id: 'VIL-001',
    name: 'Kshipra',
    district: 'Indore',
    block: 'Mhow Block',
    rankInBlock: 2,
    totalVillagesInBlock: 18,
    achievements: [
      'Top Canopy Preservation Award 2025',
      'Zero Open Burning Compliance Standard'
    ],
    passport: {
      prakritiScore: 78,
      airQualityIndex: 68,
      groundwaterIndex: 82,
      soilHealthIndex: 88,
      forestCoverPct: 24.2,
      carbonCreditsOffsetKt: 8.4
    },
    history: [
      { year: 2022, score: 72, groundwaterDepth: 16.5, canopyPct: 21.0 },
      { year: 2023, score: 74, groundwaterDepth: 15.8, canopyPct: 22.4 },
      { year: 2024, score: 75, groundwaterDepth: 15.0, canopyPct: 23.1 },
      { year: 2025, score: 77, groundwaterDepth: 14.7, canopyPct: 23.8 },
      { year: 2026, score: 78, groundwaterDepth: 14.5, canopyPct: 24.2 }
    ],
    recommendations: [
      {
        id: 'REC-001',
        category: 'water',
        title: 'Install Rooftop Rainwater Harvest Wells',
        description: 'Target 120 residential rooftops in Kshipra Sector B to offset high Rabi season irrigation drawdowns.',
        impact: 'HIGH',
        difficulty: 'EASY'
      },
      {
        id: 'REC-002',
        category: 'forestry',
        title: 'Community Agroforestry Buffer',
        description: 'Plant 4,000 bamboo saplings along river corridors to suppress agricultural run-off erosion.',
        impact: 'MEDIUM',
        difficulty: 'MODERATE'
      }
    ],
    risks: [
      {
        id: 'RSK-001',
        title: 'Pesticide Runoff',
        severity: 'WARNING',
        description: 'Elevated nitrogen presence detected in soil sensors close to western crop boundaries.'
      }
    ],
    officerNotes: [
      { date: '2026-05-12', officer: 'Arjun K. Sharma', comment: 'Wetland buffers looking healthy. Recommend seed drills for Rabi sowing.' }
    ],
    inspections: [
      { id: 'ISP-809', date: '2026-06-05', category: 'Water Quality', status: 'PASSED', inspector: 'Priya Deshmukh' },
      { id: 'ISP-814', date: '2026-06-14', category: 'Soil Toxicity Check', status: 'WARNING', inspector: 'Arjun K. Sharma' }
    ]
  },
  'VIL-002': {
    id: 'VIL-002',
    name: 'Mhow Village',
    district: 'Indore',
    block: 'Mhow Block',
    rankInBlock: 4,
    totalVillagesInBlock: 18,
    achievements: [
      'Narmada Clean River Buffer Badge 2024'
    ],
    passport: {
      prakritiScore: 71,
      airQualityIndex: 84,
      groundwaterIndex: 75,
      soilHealthIndex: 78,
      forestCoverPct: 18.5,
      carbonCreditsOffsetKt: 7.6
    },
    history: [
      { year: 2022, score: 68, groundwaterDepth: 19.5, canopyPct: 17.0 },
      { year: 2023, score: 69, groundwaterDepth: 19.0, canopyPct: 17.5 },
      { year: 2024, score: 70, groundwaterDepth: 18.6, canopyPct: 18.0 },
      { year: 2025, score: 71, groundwaterDepth: 18.2, canopyPct: 18.5 },
      { year: 2026, score: 71, groundwaterDepth: 18.2, canopyPct: 18.5 }
    ],
    recommendations: [
      {
        id: 'REC-011',
        category: 'air',
        title: 'Agricultural Residue Composting',
        description: 'Provide composting barrels to village cooperative to eliminate crop straw stubble burning.',
        impact: 'HIGH',
        difficulty: 'MODERATE'
      }
    ],
    risks: [
      {
        id: 'RSK-011',
        title: 'Groundwater Table Depletion',
        severity: 'WARNING',
        description: 'Table drawdown exceeds seasonal recharge norms. Require immediate borewell regulation.'
      }
    ],
    officerNotes: [
      { date: '2026-04-20', officer: 'Priya Deshmukh', comment: 'Borewell compliance is moderate. Standard agricultural education underway.' }
    ],
    inspections: [
      { id: 'ISP-820', date: '2026-06-10', category: 'Air Emission Audit', status: 'PASSED', inspector: 'Priya Deshmukh' }
    ]
  },
  'VIL-005': {
    id: 'VIL-005',
    name: 'Pithampur Rural',
    district: 'Dhar',
    block: 'Dhar Rural',
    rankInBlock: 14,
    totalVillagesInBlock: 15,
    achievements: [
      'First Clean Air Mitigation Grid Pilot'
    ],
    passport: {
      prakritiScore: 42,
      airQualityIndex: 240,
      groundwaterIndex: 35,
      soilHealthIndex: 42,
      forestCoverPct: 6.4,
      carbonCreditsOffsetKt: 1.2
    },
    history: [
      { year: 2022, score: 48, groundwaterDepth: 27.2, canopyPct: 7.5 },
      { year: 2023, score: 46, groundwaterDepth: 28.0, canopyPct: 7.1 },
      { year: 2024, score: 44, groundwaterDepth: 28.8, canopyPct: 6.8 },
      { year: 2025, score: 43, groundwaterDepth: 29.2, canopyPct: 6.6 },
      { year: 2026, score: 42, groundwaterDepth: 29.4, canopyPct: 6.4 }
    ],
    recommendations: [
      {
        id: 'REC-051',
        category: 'air',
        title: 'Dry Fog Smog Towers',
        description: 'Deploy 4 localized dry fog mitigation towers at agricultural borders adjoining industrial areas.',
        impact: 'HIGH',
        difficulty: 'COMPLEX'
      },
      {
        id: 'REC-052',
        category: 'water',
        title: 'Deep Recharge Shafts',
        description: 'Excavate 3 deep aquifer recharge channels to reverse heavy steel foundry water table drawdowns.',
        impact: 'HIGH',
        difficulty: 'COMPLEX'
      }
    ],
    risks: [
      {
        id: 'RSK-051',
        title: 'Heavy AQI Smog',
        severity: 'CRITICAL',
        description: 'PM2.5 average registers critical health risk due to close industrial zone foundry plumes.'
      },
      {
        id: 'RSK-052',
        title: 'Industrial Heavy Metal Seepage',
        severity: 'CRITICAL',
        description: 'Toxicity trace detected in groundwater well sector 3. Local consumption halted.'
      }
    ],
    officerNotes: [
      { date: '2026-06-01', officer: 'Arjun K. Sharma', comment: 'Borewell sector 3 blocked. Distributed water tankers active. Factory audit scheduled.' }
    ],
    inspections: [
      { id: 'ISP-830', date: '2026-06-12', category: 'Heavy Metal Water Scan', status: 'FAILED', inspector: 'Arjun K. Sharma' },
      { id: 'ISP-833', date: '2026-06-18', category: 'Industrial Stack Sniff', status: 'FAILED', inspector: 'Priya Deshmukh' }
    ]
  }
};
