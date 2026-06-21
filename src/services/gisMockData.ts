export interface LatLng {
  lat: number;
  lng: number;
}

export interface GisBoundary {
  id: string;
  name: string;
  type: 'district' | 'block' | 'village' | 'parcel';
  coordinates: LatLng[];
  parentName?: string;
  owner?: string;
  areaAcres?: number;
  ndviScore?: number;
  waterLevelDepth?: number;
  carbonStockTn?: number;
  aqiScore?: number;
}

export interface GisSensor {
  id: string;
  name: string;
  category: 'air' | 'water' | 'soil' | 'canopy';
  lat: number;
  lng: number;
  value: string | number;
  status: 'optimal' | 'warning' | 'critical';
}

// Indore/Dhar/Bhopal coordinate bounds
// Center around 22.75, 75.85
export const mpGisBoundaries: GisBoundary[] = [
  // Districts
  {
    id: 'DIST-IND',
    name: 'Indore',
    type: 'district',
    coordinates: [
      { lat: 22.95, lng: 75.60 },
      { lat: 22.98, lng: 76.05 },
      { lat: 22.55, lng: 76.10 },
      { lat: 22.50, lng: 75.65 }
    ],
    areaAcres: 954000,
    ndviScore: 0.65,
    waterLevelDepth: 14.5,
    carbonStockTn: 245000,
    aqiScore: 78
  },
  {
    id: 'DIST-DHA',
    name: 'Dhar',
    type: 'district',
    coordinates: [
      { lat: 22.85, lng: 75.10 },
      { lat: 22.90, lng: 75.58 },
      { lat: 22.35, lng: 75.60 },
      { lat: 22.30, lng: 75.15 }
    ],
    areaAcres: 1205000,
    ndviScore: 0.58,
    waterLevelDepth: 29.4,
    carbonStockTn: 310000,
    aqiScore: 240
  },
  
  // Blocks in Indore
  {
    id: 'BLK-IND-URB',
    name: 'Indore Urban',
    type: 'block',
    parentName: 'Indore',
    coordinates: [
      { lat: 22.80, lng: 75.80 },
      { lat: 22.82, lng: 75.92 },
      { lat: 22.70, lng: 75.94 },
      { lat: 22.68, lng: 75.82 }
    ],
    areaAcres: 14500,
    ndviScore: 0.42,
    waterLevelDepth: 16.8,
    carbonStockTn: 18000,
    aqiScore: 112
  },
  {
    id: 'BLK-MHOW',
    name: 'Mhow Block',
    type: 'block',
    parentName: 'Indore',
    coordinates: [
      { lat: 22.65, lng: 75.70 },
      { lat: 22.68, lng: 75.88 },
      { lat: 22.52, lng: 75.90 },
      { lat: 22.50, lng: 75.72 }
    ],
    areaAcres: 48000,
    ndviScore: 0.72,
    waterLevelDepth: 18.2,
    carbonStockTn: 89000,
    aqiScore: 84
  },

  // Villages
  {
    id: 'VIL-KSHIPRA',
    name: 'Kshipra',
    type: 'village',
    parentName: 'Mhow Block',
    coordinates: [
      { lat: 22.60, lng: 75.75 },
      { lat: 22.62, lng: 75.82 },
      { lat: 22.57, lng: 75.84 },
      { lat: 22.55, lng: 75.77 }
    ],
    areaAcres: 3450,
    ndviScore: 0.76,
    waterLevelDepth: 14.5,
    carbonStockTn: 8400,
    aqiScore: 68
  },
  {
    id: 'VIL-MHOWVIL',
    name: 'Mhow Village',
    type: 'village',
    parentName: 'Mhow Block',
    coordinates: [
      { lat: 22.54, lng: 75.73 },
      { lat: 22.55, lng: 75.79 },
      { lat: 22.51, lng: 75.81 },
      { lat: 22.50, lng: 75.75 }
    ],
    areaAcres: 4120,
    ndviScore: 0.71,
    waterLevelDepth: 18.2,
    carbonStockTn: 7600,
    aqiScore: 84
  },
  {
    id: 'VIL-PITHAMPUR',
    name: 'Pithampur Rural',
    type: 'village',
    parentName: 'Dhar Rural',
    coordinates: [
      { lat: 22.62, lng: 75.35 },
      { lat: 22.64, lng: 75.48 },
      { lat: 22.57, lng: 75.50 },
      { lat: 22.55, lng: 75.37 }
    ],
    areaAcres: 8900,
    ndviScore: 0.32,
    waterLevelDepth: 29.4,
    carbonStockTn: 1200,
    aqiScore: 240
  },

  // Parcels inside Kshipra Village
  {
    id: 'PRC-KSH-101',
    name: 'Parcel #101',
    type: 'parcel',
    parentName: 'Kshipra',
    owner: 'Ramesh Patel',
    coordinates: [
      { lat: 22.59, lng: 75.76 },
      { lat: 22.60, lng: 75.78 },
      { lat: 22.59, lng: 75.79 },
      { lat: 22.58, lng: 75.77 }
    ],
    areaAcres: 12.4,
    ndviScore: 0.81,
    waterLevelDepth: 13.9,
    carbonStockTn: 45
  },
  {
    id: 'PRC-KSH-102',
    name: 'Parcel #102',
    type: 'parcel',
    parentName: 'Kshipra',
    owner: 'Sita Bai',
    coordinates: [
      { lat: 22.58, lng: 75.77 },
      { lat: 22.59, lng: 75.79 },
      { lat: 22.58, lng: 75.80 },
      { lat: 22.57, lng: 75.78 }
    ],
    areaAcres: 18.2,
    ndviScore: 0.74,
    waterLevelDepth: 14.8,
    carbonStockTn: 60
  },
  {
    id: 'PRC-KSH-103',
    name: 'Parcel #103',
    type: 'parcel',
    parentName: 'Kshipra',
    owner: 'Narendra Singh',
    coordinates: [
      { lat: 22.57, lng: 75.78 },
      { lat: 22.58, lng: 75.80 },
      { lat: 22.57, lng: 75.82 },
      { lat: 22.56, lng: 75.80 }
    ],
    areaAcres: 8.5,
    ndviScore: 0.68,
    waterLevelDepth: 15.2,
    carbonStockTn: 32
  },

  // Parcels inside Pithampur Rural
  {
    id: 'PRC-PIT-501',
    name: 'Parcel #501',
    type: 'parcel',
    parentName: 'Pithampur Rural',
    owner: 'Dhar Industrial Corp',
    coordinates: [
      { lat: 22.60, lng: 75.38 },
      { lat: 22.61, lng: 75.42 },
      { lat: 22.59, lng: 75.43 },
      { lat: 22.58, lng: 75.39 }
    ],
    areaAcres: 142.0,
    ndviScore: 0.21,
    waterLevelDepth: 31.2,
    carbonStockTn: 4
  },
  {
    id: 'PRC-PIT-502',
    name: 'Parcel #502',
    type: 'parcel',
    parentName: 'Pithampur Rural',
    owner: 'Shivaji Maharaj Trust',
    coordinates: [
      { lat: 22.58, lng: 75.40 },
      { lat: 22.59, lng: 75.44 },
      { lat: 22.57, lng: 75.45 },
      { lat: 22.56, lng: 75.41 }
    ],
    areaAcres: 48.5,
    ndviScore: 0.44,
    waterLevelDepth: 28.1,
    carbonStockTn: 18
  }
];

export const mpGisSensors: GisSensor[] = [
  { id: 'SNS-001', name: 'Kshipra Aquifer Prober', category: 'water', lat: 22.58, lng: 75.78, value: '-14.5m', status: 'optimal' },
  { id: 'SNS-002', name: 'Mhow Forestry Air Sniffer', category: 'air', lat: 22.62, lng: 75.80, value: '84 AQI', status: 'optimal' },
  { id: 'SNS-003', name: 'Pithampur Stack Monitoring Stn', category: 'air', lat: 22.59, lng: 75.42, value: '240 AQI', status: 'critical' },
  { id: 'SNS-004', name: 'Sardarpur Soil Moisture Sensor', category: 'soil', lat: 22.50, lng: 75.45, value: '0.45 m3/m3', status: 'optimal' },
  { id: 'SNS-005', name: 'Dhar Canopy Growth Laser', category: 'canopy', lat: 22.45, lng: 75.30, value: '74% coverage', status: 'warning' }
];

export const mockTimelineData = [
  { year: 2021, forestCoverPct: 18.2, groundwaterAvgDepth: 16.5, activeFires: 8 },
  { year: 2022, forestCoverPct: 19.5, groundwaterAvgDepth: 15.8, activeFires: 5 },
  { year: 2023, forestCoverPct: 20.4, groundwaterAvgDepth: 14.1, activeFires: 12 },
  { year: 2024, forestCoverPct: 21.0, groundwaterAvgDepth: 13.2, activeFires: 7 },
  { year: 2025, forestCoverPct: 21.5, groundwaterAvgDepth: 12.8, activeFires: 3 },
  { year: 2026, forestCoverPct: 21.7, groundwaterAvgDepth: 12.4, activeFires: 2 }
];
