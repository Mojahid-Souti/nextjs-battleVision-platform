// src/utils/dataProcessing.ts
import { MetricData, ThreatData } from '@/types/analytics';


export const processThreatsForTable = (threats: ThreatData[]) => {
  return threats.map(threat => ({
    ...threat,
    detectionScore: threat.detectionScore / 100,
    confidence: threat.confidence / 100
  }));
};

export const calculateMetrics = (threats: ThreatData[]): MetricData => {
  return {
    totalThreats: threats.length,
    criticalThreats: threats.filter(t => t.severity === 'critical').length,
    resolvedThreats: threats.filter(t => t.status === 'resolved').length,
    averageConfidence: threats.length > 0 
      ? threats.reduce((acc, t) => acc + t.confidence, 0) / threats.length 
      : 0
  };
};