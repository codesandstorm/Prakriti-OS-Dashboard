export interface SchemeMetric {
  id: string;
  name: string;
  budgetAllocatedCr: number;
  budgetSpentCr: number;
  targetBeneficiaries: number;
  activeBeneficiaries: number;
  completionPct: number;
  sector: 'Forestry' | 'Water' | 'Air' | 'Waste';
}

export interface BudgetMetric {
  id: string;
  department: string;
  allocatedInrCr: number;
  utilizedInrCr: number;
  commitedInrCr: number;
  auditStatus: 'AUDITED' | 'IN-PROGRESS' | 'PENDING';
}

export interface PensionDistribution {
  id: string;
  villageName: string;
  eligibleFarmers: number;
  distributedInrLakhs: number;
  pendingClaims: number;
  complianceRate: number;
}

export interface CarbonIncentive {
  id: string;
  villageName: string;
  creditsVerifiedKt: number;
  incentivePaidInrLakhs: number;
  verificationAgency: string;
  payoutStatus: 'PAID' | 'PROCESSING' | 'HOLD';
}

export const schemeMetrics: SchemeMetric[] = [
  { id: 'SCH-01', name: 'MP Green Canopy plantation', budgetAllocatedCr: 45.5, budgetSpentCr: 35.8, targetBeneficiaries: 145000, activeBeneficiaries: 132000, completionPct: 78, sector: 'Forestry' },
  { id: 'SCH-02', name: 'Narmada River Catchment restoration', budgetAllocatedCr: 120.0, budgetSpentCr: 74.4, targetBeneficiaries: 890000, activeBeneficiaries: 680000, completionPct: 62, sector: 'Water' },
  { id: 'SCH-03', name: 'Alkaline Soil Remediation subsidy', budgetAllocatedCr: 15.8, budgetSpentCr: 14.5, targetBeneficiaries: 320000, activeBeneficiaries: 310000, completionPct: 92, sector: 'Water' },
  { id: 'SCH-04', name: 'Clean Air Chimney Scrubbing grant', budgetAllocatedCr: 80.0, budgetSpentCr: 32.0, targetBeneficiaries: 2200000, activeBeneficiaries: 1800000, completionPct: 40, sector: 'Air' }
];

export const budgetMetrics: BudgetMetric[] = [
  { id: 'BDG-01', department: 'Forestry Department', allocatedInrCr: 65.2, utilizedInrCr: 48.6, commitedInrCr: 12.4, auditStatus: 'AUDITED' },
  { id: 'BDG-02', department: 'Water Resources board', allocatedInrCr: 140.0, utilizedInrCr: 98.4, commitedInrCr: 28.2, auditStatus: 'IN-PROGRESS' },
  { id: 'BDG-03', department: 'Pollution Control board', allocatedInrCr: 48.0, utilizedInrCr: 32.0, commitedInrCr: 8.5, auditStatus: 'AUDITED' },
  { id: 'BDG-04', department: 'Agriculture & Soil board', allocatedInrCr: 35.5, utilizedInrCr: 29.8, commitedInrCr: 4.1, auditStatus: 'PENDING' }
];

export const pensionDistributions: PensionDistribution[] = [
  { id: 'PEN-01', villageName: 'Kshipra', eligibleFarmers: 1420, distributedInrLakhs: 42.6, pendingClaims: 12, complianceRate: 98 },
  { id: 'PEN-02', villageName: 'Mhow Village', eligibleFarmers: 1890, distributedInrLakhs: 56.7, pendingClaims: 24, complianceRate: 95 },
  { id: 'PEN-03', villageName: 'Misrod', eligibleFarmers: 2400, distributedInrLakhs: 68.2, pendingClaims: 142, complianceRate: 84 },
  { id: 'PEN-04', villageName: 'Pithampur Rural', eligibleFarmers: 980, distributedInrLakhs: 24.5, pendingClaims: 88, complianceRate: 78 }
];

export const carbonIncentives: CarbonIncentive[] = [
  { id: 'CAR-01', villageName: 'Kshipra', creditsVerifiedKt: 8.4, incentivePaidInrLakhs: 16.8, verificationAgency: 'Gold Standard Inc', payoutStatus: 'PAID' },
  { id: 'CAR-02', villageName: 'Mhow Village', creditsVerifiedKt: 7.6, incentivePaidInrLakhs: 15.2, verificationAgency: 'Verra Climate Registry', payoutStatus: 'PAID' },
  { id: 'CAR-03', villageName: 'Budhni', creditsVerifiedKt: 12.4, incentivePaidInrLakhs: 24.8, verificationAgency: 'Gold Standard Inc', payoutStatus: 'PROCESSING' },
  { id: 'CAR-04', villageName: 'Pithampur Rural', creditsVerifiedKt: 1.2, incentivePaidInrLakhs: 0.8, verificationAgency: 'Verra Climate Registry', payoutStatus: 'HOLD' }
];
