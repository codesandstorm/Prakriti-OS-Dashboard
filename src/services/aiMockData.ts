export interface AiModelForecast {
  id: string;
  category: 'fire' | 'water' | 'flood' | 'crop' | 'carbon';
  title: string;
  description: string;
  baseRiskPct: number;
  confidenceScore: number;
  evidence: string[];
  dataSources: string[];
  modelId: string;
  affectedVillages: string[];
}

export interface ScenarioResult {
  fireRiskPct: number;
  groundwaterRiskPct: number;
  cropYieldPct: number;
  carbonOffsetKt: number;
  prakritiScoreDelta: number;
}

export const aiModelForecasts: AiModelForecast[] = [
  {
    id: 'AI-FIRE-001',
    category: 'fire',
    title: 'Forest Fire Prediction',
    description: 'Elevated dry biomass and moisture deficit signaling high combustion probability.',
    baseRiskPct: 78,
    confidenceScore: 92,
    evidence: [
      'Land Surface Temperature (LST) exceeds 42°C for 5 consecutive days',
      'Foliar moisture index dropped below 14% threshold',
      'Wind velocity registers 18km/h gusting to SSE'
    ],
    dataSources: [
      'ISRO INSAT-3DR Thermal Imager',
      'Satpura Micro-weather Station #S4B',
      'Ground Canopy Laser Sensors'
    ],
    modelId: 'FIRE-CONTOUR-v5.2',
    affectedVillages: ['Sardarpur', 'Budhni']
  },
  {
    id: 'AI-WATER-002',
    category: 'water',
    title: 'Groundwater Depletion Risk',
    description: 'Aquifer drawdown speed exceeds natural percolation recharge metrics.',
    baseRiskPct: 64,
    confidenceScore: 88,
    evidence: [
      'Borewell depth sensors show 1.4m avg seasonal drop',
      'Normalized Difference Water Index (NDWI) registers -0.22 deviation',
      'Excess agricultural water suction logs'
    ],
    dataSources: [
      'CGWB Aquifer Telemetry API',
      'Sentinel-2 Hydrology Mapping Bands',
      'Dhar Village Borewell Probers'
    ],
    modelId: 'HYDRO-TREND-v3.0',
    affectedVillages: ['Pithampur Rural', 'Misrod']
  },
  {
    id: 'AI-FLOOD-003',
    category: 'flood',
    title: 'Flood Vulnerability Forecast',
    description: 'High precipitation intensity forecast matching river catchment overflow points.',
    baseRiskPct: 15,
    confidenceScore: 94,
    evidence: [
      'Simulated 120mm rainfall overflow modeling',
      'Narmada River tributary flow rate registers 8,400 cusecs',
      'Soil saturation index at 92%'
    ],
    dataSources: [
      'IMD Doppler Radar Monsoon tracker',
      'River Gauging telemetry nodes',
      'Topographic Digital Elevation Models (DEM)'
    ],
    modelId: 'FLOOD-FLOW-v4.1',
    affectedVillages: ['Kshipra']
  },
  {
    id: 'AI-CROP-004',
    category: 'crop',
    title: 'Crop Failure & Soil Saturation',
    description: 'High soil alkaline levels combined with irregular monsoon showers.',
    baseRiskPct: 45,
    confidenceScore: 85,
    evidence: [
      'Soil pH sensor grid registering 8.4',
      'Foliar canopy nitrogen reflection deficit',
      'Temperature anomalies during sowing stage'
    ],
    dataSources: [
      'Agri-Gov Soil Card Registry',
      'Hyperspectral drone mappings',
      'Local farming tractor moisture probers'
    ],
    modelId: 'AGRO-SOIL-v2.8',
    affectedVillages: ['Mhow Village', 'Pithampur Rural']
  },
  {
    id: 'AI-CARBON-005',
    category: 'carbon',
    title: 'Carbon Offset Projection',
    description: 'Assessing canopy biomass growth rate to determine offset credits.',
    baseRiskPct: 82, // Represents offset achievement forecast probability
    confidenceScore: 90,
    evidence: [
      'Reforestation projects cover 74,200 saplings',
      'Tree density models suggest 820 kT CO2e yearly capture path',
      'Verified soil carbon sequestration checks'
    ],
    dataSources: [
      'Gold Standard Registry audits',
      'Biomass Canopy LiDAR datasets',
      'Village carbon credit registries'
    ],
    modelId: 'CARBON-GROWTH-v1.6',
    affectedVillages: ['Kshipra', 'Budhni']
  }
];

export const calculateScenarioSimulation = (
  budgetModifier: number,       // 0 to 100
  emissionCapModifier: number,  // 0 to 100
  plantationModifier: number    // 0 to 100
): ScenarioResult => {
  // Simple deterministic model mapping inputs to outputs
  // Reforestation reduces fire risk (better management) and boosts carbon capture
  // Budget reduces water risk and boosts general scores
  // Emission cap limits industrial air/fire risk

  const fireRisk = Math.max(10, Math.round(78 - (plantationModifier * 0.3) - (emissionCapModifier * 0.2)));
  const waterRisk = Math.max(15, Math.round(64 - (budgetModifier * 0.4)));
  const cropYield = Math.min(100, Math.round(60 + (budgetModifier * 0.25) + (plantationModifier * 0.15)));
  const carbonOffset = Math.round(842 + (plantationModifier * 4.2) + (budgetModifier * 1.5));
  
  const scoreDelta = Math.round(
    (budgetModifier * 0.1) + (emissionCapModifier * 0.12) + (plantationModifier * 0.08) - 10
  );

  return {
    fireRiskPct: fireRisk,
    groundwaterRiskPct: waterRisk,
    cropYieldPct: cropYield,
    carbonOffsetKt: carbonOffset,
    prakritiScoreDelta: scoreDelta
  };
};
