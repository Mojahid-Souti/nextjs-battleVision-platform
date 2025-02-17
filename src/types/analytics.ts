// src/types/analytics.ts
export type ThreatType = 'anomaly' | 'unauthorized_access' | 'cyber_attack' | 'intrusion';
export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ThreatStatus = 'detected' | 'analyzing' | 'mitigated' | 'resolved';

export interface ThreatDetails {
  source: string;
  targetSystem: string;
  description: string;
  recommendations: string[];
}

export interface ThreatData {
  id: string;
  timestamp: Date;
  type: ThreatType;
  severity: ThreatSeverity;
  location: string;
  detectionScore: number;
  confidence: number;
  status: ThreatStatus;
  details: ThreatDetails;
}

export interface MetricData {
  totalThreats: number;
  criticalThreats: number;
  resolvedThreats: number;
  averageConfidence: number;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface ThreatsTableData extends ThreatData {
  aiConfidence: number;
}