// src/services/AIAnalysisService.ts
import { SecurityAlert, ThreatPrediction } from '@/types/monitoring';

export class AIAnalysisService {
  public async analyzeThreat(alert: SecurityAlert): Promise<ThreatPrediction> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get prediction based on alert type
    const prediction = this.generatePrediction(alert);
    
    return prediction;
  }

  private generatePrediction(alert: SecurityAlert): ThreatPrediction {
    const baseConfidence = this.calculateBaseConfidence(alert);
    const impact = this.determineImpact(alert);

    return {
      probability: Math.min(Math.random() * 0.3 + baseConfidence, 1),
      type: this.getPredictionType(alert),
      impact,
      confidence: baseConfidence,
      reasoning: this.generateReasoning(alert)
    };
  }

  private calculateBaseConfidence(alert: SecurityAlert): number {
    const severityWeight = {
      critical: 0.9,
      high: 0.8,
      medium: 0.6,
      low: 0.4
    };

    return severityWeight[alert.severity];
  }

  private determineImpact(alert: SecurityAlert): 'low' | 'medium' | 'high' {
    switch (alert.severity) {
      case 'critical':
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      default:
        return 'low';
    }
  }

  private getPredictionType(alert: SecurityAlert): string {
    const types = {
      cyber_attack: [
        'GPS Spoofing Attack',
        'Command Injection',
        'Communication Jamming',
        'Data Exfiltration'
      ],
      intrusion: [
        'Perimeter Breach',
        'Unauthorized Access',
        'Zone Infiltration'
      ],
      anomaly: [
        'Behavioral Deviation',
        'Pattern Anomaly',
        'System Malfunction'
      ],
      unauthorized_access: [
        'Credential Misuse',
        'Access Control Bypass',
        'Authentication Failure'
      ]
    };

    const possibleTypes = types[alert.type] || ['Unknown Threat'];
    return possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
  }

  private generateReasoning(alert: SecurityAlert): string[] {
    const commonReasons = {
      cyber_attack: [
        'Abnormal signal patterns detected',
        'Multiple assets reporting anomalies',
        'Matches known attack signatures',
        'Suspicious network traffic detected'
      ],
      intrusion: [
        'Motion sensors triggered',
        'Security perimeter breached',
        'Unauthorized movement detected',
        'Multiple zone violations'
      ],
      anomaly: [
        'Deviation from normal behavior patterns',
        'Unexpected system responses',
        'Statistical anomalies detected',
        'Pattern recognition alerts'
      ],
      unauthorized_access: [
        'Invalid credentials used',
        'Multiple failed access attempts',
        'Access from unauthorized location',
        'Temporal access pattern violation'
      ]
    };

    const reasons = commonReasons[alert.type] || ['Unknown threat pattern detected'];
    const numReasons = Math.floor(Math.random() * 2) + 2; // 2-3 reasons
    return reasons.slice(0, numReasons);
  }
}

export const aiAnalysisService = new AIAnalysisService();