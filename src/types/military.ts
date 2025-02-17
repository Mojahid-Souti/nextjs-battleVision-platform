
// src/types/military.ts
export type Coordinate = [number, number];

export type AssetType = 'drone' | 'sensor';
export type AttackType = 'DDoS' | 'MitM' | 'Spoofing' | 'Jamming';
export type AttackStatus = 'preparing' | 'ongoing' | 'detected' | 'mitigated';
export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AssetDistribution {
  drones: number;
  sensors: number;  // Added sensors to match our new requirements
}
interface BaseAsset {
  id: string;
  position: Coordinate;
}

export interface Asset extends BaseAsset {
  type: AssetType;
}

export interface ZoneAssets {
  tanks: BaseAsset[];
  drones: BaseAsset[];
  planes: BaseAsset[];
}


export interface AnimationState {
  position: Coordinate;
  bearing: number;
}


export interface ZoneStyle {
  fillColor: string;
  fillOpacity: number;
  hoverColor: string;
  hoverOpacity: number;
  borderColor: string;
  borderWidth: number;
  borderGlow: string;
}

export interface AssetDistribution {
  drones: number;
  sensors: number;
}

export interface SurveillanceZone {
  id: string;
  name: string;
  center: [number, number];
  coordinates: [number, number][];
  style: ZoneStyle;
  assetDistribution: AssetDistribution;
}


export interface ThreatAnalysis {
  recommendation: string;
  confidence: number;
  suggestedActions: string[];
  estimatedImpact: string;
}

export interface AttackDetection {
  attackId: string;
  detectedBy: string;
  detectionTime: number;
  confidence: number;
  responseTime: number;
}

export interface AIAnalysisResponse {
  analysis: string;
  confidence: number;
  recommendations: string[];
  impact: string;
  pattern_details?: {
    complexity: number;
    predictability: number;
    similarity_to_known_attacks: number;
  };
}

export interface Attack {
  id: string;
  type: AttackType;
  source: Coordinate;
  target: Coordinate;
  intensity: number;
  startTime: number;
  duration: number;
  status: 'preparing' | 'ongoing' | 'detected' | 'mitigated';
  threatLevel: ThreatLevel;
  pattern?: {
    protocol: string;
    service: string;
    sourcePackets: number;
    destPackets: number;
    sourceBytes: number;
    destBytes: number;
    state: string;
  };
}

export interface NetworkTraffic {
  packets: number;
  bytes: number;
  protocol: string;
  service: string;
}

export interface DetectionResult {
  detected: boolean;
  type?: AttackType;
  confidence?: number;
  details?: {
    protocol: string;
    service: string;
    intensity: number;
  };
}
