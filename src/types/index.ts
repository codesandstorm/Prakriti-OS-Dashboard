export type UserRole = 
  | 'Collector' 
  | 'Commissioner' 
  | 'Secretary' 
  | 'District Officer' 
  | 'Environmental Officer' 
  | 'Admin';

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'en' | 'hi';
  units: 'metric' | 'imperial';
  dateFormat: 'YYYY-MM-DD' | 'DD-MM-YYYY';
  mapPreference: 'satellite' | 'terrain' | 'vector';
  accessibilityScale: 'normal' | 'large' | 'extra-large';
  notificationsEnabled: boolean;
}

export interface DashboardFilters {
  district: string;
  block: string;
  village: string;
  dateRange: string;
  season: string;
  scheme: string;
  department: string;
  environmentalLayer: string;
}

export interface AppNotification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success' | 'assignment' | 'approval' | 'inspection' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface Officer {
  id: string;
  name: string;
  designation: string;
  district: string;
  activeAssignments: string[];
  perfScore: number;
  status: 'ACTIVE' | 'ON-FIELD' | 'INACTIVE';
  avatarUrl: string;
  experienceYears?: number;
  reportsSubmitted?: number;
  lastActivityLocation?: string;
  lastActivityTime?: string;
  lastActivityMapUrl?: string;
}

export interface Incident {
  id: string;
  code: string;
  severity: 'CRITICAL' | 'WARNING' | 'RESPONDED' | 'RESOLVED';
  time: string;
  title: string;
  description: string;
  location: string;
  district: string;
  temperature?: string;
  flowRate?: string;
  threatRadius?: string;
  coordinates: string;
  teamDeployed?: string;
  coreTemp?: string;
  windVelocity?: string;
  humidity?: string;
}

export interface KpiMetric {
  id?: string;
  title?: string;
  value: string | number;
  trend: string;
  trendDirection: 'up' | 'down' | 'stable';
  label: string;
  sparklineValues?: number[];
  progress?: number;
  color?: string;
}

export interface MapLayer {
  id: string;
  label: string;
  active: boolean;
  color: string;
}

export interface TelemetryState {
  coordinates: string;
  temperature: string;
  humidity: string;
  windVelocity: string;
  threatRadius: string;
}

export type BaseMapMode = 'satellite' | 'terrain' | 'road' | 'hybrid';

export interface GisBoundary {
  id: string;
  name: string;
  type: 'district' | 'block' | 'village' | 'parcel';
  coordinates: { lat: number; lng: number }[];
  parentName?: string;
  owner?: string;
  areaAcres?: number;
  ndviScore?: number;
  waterLevelDepth?: number;
  carbonStockTn?: number;
  aqiScore?: number;
}

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
