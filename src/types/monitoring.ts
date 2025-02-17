// src/types/monitoring.ts
import { Coordinate } from './military';

export type AlertType = 'cyber_attack' | 'intrusion' | 'anomaly' | 'unauthorized_access';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'detected' | 'analyzing' | 'mitigated' | 'resolved';
export type AssetType = 'tank' | 'drone' | 'plane';
export type ImpactLevel = 'low' | 'medium' | 'high';

export interface SecurityAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  timestamp: Date;
  location: string;
  description: string;
  suggestedActions: string[];
  automaticResponses: string[];
  status: AlertStatus;
}

export interface ThreatPrediction {
  probability: number;
  type: string;
  impact: ImpactLevel;
  confidence: number;
  reasoning: string[];
}

export interface AssetStatus {
  id: string;
  type: AssetType;
  status: 'operational' | 'warning' | 'critical';
  battery?: number;
  fuel?: number;
  lastUpdate: Date;
  position: Coordinate;
  alerts: SecurityAlert[];
}