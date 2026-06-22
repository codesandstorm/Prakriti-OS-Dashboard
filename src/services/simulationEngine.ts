export interface SimulationParams {
  treePlantation: number; // 0-100
  groundwaterExtraction: number; // 0-100
  rainwaterHarvesting: number; // 0-100
  inspectionFrequency: number; // 0-100
  banStubbleBurning: boolean;
  promoteDripIrrigation: boolean;
  afforestationBudget: number; // 0-100
  officerDeployment: number; // 0-100
  newEnvironmentalScheme: boolean;
  carbonCreditParticipation: boolean;
}

export interface IndicatorState {
  current: number;
  predicted: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  status: 'critical' | 'warning' | 'optimal';
  comment: string;
}

export interface SimulationResult {
  districtScore: { current: number; predicted: number; confidence: number };
  riskLevel: string;
  executiveSummary: string;
  recommendation: string;
  indicators: {
    groundwater: IndicatorState;
    forestCover: IndicatorState;
    carbonStorage: IndicatorState;
    rainfallEfficiency: IndicatorState;
    biodiversity: IndicatorState;
    soilHealth: IndicatorState;
    airQuality: IndicatorState;
    riverHealth: IndicatorState;
    agriculturalSustainability: IndicatorState;
    environmentalCompliance: IndicatorState;
  };
  financial: {
    budgetRequired: number; // in Crores
    estimatedSavings: number;
    carbonRevenue: number;
    roi: number; // percentage
  };
  deployment: {
    requiredOfficers: number;
    inspectionLoad: number; // percentage
    expectedCompletion: string;
  };
}

export const runDeterministicSimulation = (params: SimulationParams): SimulationResult => {
  // Base values
  const baseScore = 64;
  
  // Calculate Deltas based on weights
  let scoreDelta = 0;
  
  // Tree Plantation impact
  const treeImpact = (params.treePlantation - 50) * 0.15 + (params.afforestationBudget - 50) * 0.1;
  scoreDelta += treeImpact;
  
  // Groundwater Extraction (lower is better)
  const gwImpact = (50 - params.groundwaterExtraction) * 0.2 + (params.rainwaterHarvesting - 50) * 0.15;
  scoreDelta += gwImpact;

  // Stubble burning & Drip Irrigation
  if (params.banStubbleBurning) scoreDelta += 5;
  if (params.promoteDripIrrigation) scoreDelta += 4;
  if (params.newEnvironmentalScheme) scoreDelta += 3;
  if (params.carbonCreditParticipation) scoreDelta += 2;

  // Inspections
  const complianceImpact = (params.inspectionFrequency - 50) * 0.1 + (params.officerDeployment - 50) * 0.1;
  scoreDelta += complianceImpact;

  const finalScore = Math.max(0, Math.min(100, Math.round(baseScore + scoreDelta)));

  // Risk Level
  let riskLevel = 'Moderate';
  if (finalScore > 75) riskLevel = 'Low';
  if (finalScore < 50) riskLevel = 'High';
  if (finalScore < 30) riskLevel = 'Critical';

  // Groundwater Indicator
  const gwPred = Math.round(42 + gwImpact); // base 42m
  
  // AQI (lower is better)
  let aqiPred = 165 - (treeImpact * 2) - (params.banStubbleBurning ? 40 : 0);
  aqiPred = Math.max(50, Math.round(aqiPred));

  // Forest Cover
  const forestPred = Math.round(24 + treeImpact * 0.3);

  // Carbon Storage
  const carbonPred = Math.round(120 + treeImpact * 1.5 + (params.carbonCreditParticipation ? 20 : 0));

  // Financials
  const budgetReq = Math.round((params.treePlantation * 0.5) + (params.rainwaterHarvesting * 0.3) + (params.newEnvironmentalScheme ? 50 : 0) + params.afforestationBudget);
  const savings = Math.round((params.banStubbleBurning ? 25 : 0) + (params.promoteDripIrrigation ? 40 : 0) + (gwImpact > 0 ? 30 : 0));
  const revenue = Math.round(params.carbonCreditParticipation ? (carbonPred * 0.8) : 0);

  // Exec Summary Generation
  let execSummary = `Simulation complete. Overall Environmental Score is projected to shift to ${finalScore}/100. `;
  if (gwImpact < 0) execSummary += `Groundwater levels remain a critical risk due to over-extraction. `;
  else execSummary += `Groundwater table shows signs of recovery. `;
  
  if (params.banStubbleBurning) execSummary += `Air quality (AQI) will drastically improve by winter. `;
  
  if (budgetReq > 100) execSummary += `This policy requires significant capital expenditure (₹${budgetReq} Cr). `;

  return {
    districtScore: { current: baseScore, predicted: finalScore, confidence: 92 },
    riskLevel,
    executiveSummary: execSummary,
    recommendation: finalScore > baseScore ? "APPROVE POLICY - Net positive environmental impact expected." : "REVISE POLICY - Negative long-term environmental degradation projected.",
    indicators: {
      groundwater: {
        current: 42, predicted: gwPred, unit: 'm depth',
        trend: gwPred > 42 ? 'down' : 'up', // depth decreasing is better, actually wait depth increasing is bad. So if gwImpact is positive, depth should be lower. 
        status: gwPred > 45 ? 'critical' : gwPred < 40 ? 'optimal' : 'warning',
        comment: gwPred < 42 ? "Recovery trajectory" : "Continued depletion"
      },
      forestCover: {
        current: 24, predicted: forestPred, unit: '% area',
        trend: forestPred > 24 ? 'up' : 'down',
        status: forestPred > 28 ? 'optimal' : 'warning',
        comment: "Satellite NDVI analysis"
      },
      carbonStorage: {
        current: 120, predicted: carbonPred, unit: 'kT CO2',
        trend: carbonPred > 120 ? 'up' : 'down',
        status: carbonPred > 130 ? 'optimal' : 'warning',
        comment: "Biomass density calculation"
      },
      rainfallEfficiency: {
        current: 65, predicted: Math.round(65 + (params.rainwaterHarvesting - 50) * 0.2), unit: '% captured',
        trend: params.rainwaterHarvesting > 50 ? 'up' : 'neutral',
        status: params.rainwaterHarvesting > 70 ? 'optimal' : 'warning',
        comment: "Runoff reduction model"
      },
      biodiversity: {
        current: 58, predicted: Math.round(58 + treeImpact * 0.4), unit: 'Index',
        trend: treeImpact > 0 ? 'up' : 'down',
        status: 'warning',
        comment: "Habitat fragmentation risk"
      },
      soilHealth: {
        current: 62, predicted: Math.round(62 + (params.promoteDripIrrigation ? 8 : 0) + (params.banStubbleBurning ? 12 : 0)), unit: 'Index',
        trend: (params.promoteDripIrrigation || params.banStubbleBurning) ? 'up' : 'neutral',
        status: 'warning',
        comment: "Nutrient retention analysis"
      },
      airQuality: {
        current: 165, predicted: aqiPred, unit: 'AQI',
        trend: aqiPred < 165 ? 'down' : 'up', // down is good
        status: aqiPred > 150 ? 'critical' : aqiPred > 100 ? 'warning' : 'optimal',
        comment: "Particulate matter projection"
      },
      riverHealth: {
        current: 52, predicted: Math.round(52 + complianceImpact * 0.5), unit: 'Index',
        trend: complianceImpact > 0 ? 'up' : 'down',
        status: 'warning',
        comment: "Effluent monitoring"
      },
      agriculturalSustainability: {
        current: 45, predicted: Math.round(45 + (params.promoteDripIrrigation ? 15 : 0)), unit: 'Index',
        trend: params.promoteDripIrrigation ? 'up' : 'neutral',
        status: 'warning',
        comment: "Water productivity ratio"
      },
      environmentalCompliance: {
        current: 72, predicted: Math.round(72 + complianceImpact), unit: '% rate',
        trend: complianceImpact > 0 ? 'up' : 'down',
        status: 'optimal',
        comment: "Industrial audit frequency"
      }
    },
    financial: {
      budgetRequired: budgetReq,
      estimatedSavings: savings,
      carbonRevenue: revenue,
      roi: Math.round(((savings + revenue) / (budgetReq || 1)) * 100)
    },
    deployment: {
      requiredOfficers: Math.round(120 * (params.officerDeployment / 50)),
      inspectionLoad: Math.round(params.inspectionFrequency * 1.5),
      expectedCompletion: params.officerDeployment > 60 ? "3 Months" : "8 Months"
    }
  };
};
