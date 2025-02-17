// src/services/MLService.ts
import { ThreatData } from '@/types/analytics';

interface PredictionResult {
  probability: number;
  confidence: number;
  suggestedActions: string[];
}

class MLService {
  private readonly MODEL_WEIGHTS = {
    cyber_attack: 0.85,
    intrusion: 0.78,
    anomaly: 0.72,
    unauthorized_access: 0.81
  };

  analyzeThreat(threat: ThreatData): PredictionResult {
    const baseScore = this.MODEL_WEIGHTS[threat.type];
    const severityMultiplier = this.getSeverityMultiplier(threat.severity);
    const probability = Math.min(baseScore * severityMultiplier, 1);
    const confidence = Math.min(probability * 1.1, 0.99);

    return {
      probability,
      confidence,
      suggestedActions: this.generateActions(threat)
    };
  }

  private getSeverityMultiplier(severity: string): number {
    switch (severity) {
      case 'critical': return 1.0;
      case 'high': return 0.8;
      case 'medium': return 0.6;
      case 'low': return 0.4;
      default: return 0.5;
    }
  }

  private generateActions(threat: ThreatData): string[] {
    const actions = new Set<string>();
    
    if (threat.severity === 'critical' || threat.severity === 'high') {
      actions.add('Immediate response required');
      actions.add('Isolate affected systems');
      actions.add('Deploy emergency countermeasures');
    }

    if (threat.detectionScore > 0.8) {
      actions.add('Activate enhanced monitoring');
      actions.add('Review system logs');
    }

    return Array.from(actions);
  }
}

export const mlService = new MLService();