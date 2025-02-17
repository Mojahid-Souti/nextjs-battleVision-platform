// src/services/AlertGenerator.ts
import { ThreatData } from '@/types/analytics';

class AlertGenerator {
  private readonly locations = ['Muscat Zone', 'Sohar Zone', 'Matrah Zone', 'Sur Zone', 'Khoudh Zone'];
  private readonly threatTypes: ThreatData['type'][] = ['anomaly', 'unauthorized_access', 'cyber_attack', 'intrusion'];
  private readonly severities: ThreatData['severity'][] = ['low', 'medium', 'high', 'critical'];
  private readonly systems = ['Network Infrastructure', 'Database Server', 'Web Application', 'Security System', 'IoT Devices'];

  public generateThreat(forceSeverity?: ThreatData['severity']): ThreatData {
    const type = this.getRandomItem(this.threatTypes);
    const severity = forceSeverity || this.getRandomItem(this.severities);
    const location = this.getRandomItem(this.locations);
    const targetSystem = this.getRandomItem(this.systems);

    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type,
      severity,
      location,
      detectionScore: 70 + Math.floor(Math.random() * 30),
      confidence: 80 + Math.floor(Math.random() * 20),
      status: 'detected',
      details: {
        source: this.generateSourceIP(),
        targetSystem,
        description: this.generateDescription(type, targetSystem),
        recommendations: this.generateRecommendations(type)
      }
    };
  }

  private getRandomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  private generateSourceIP(): string {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
  }

  private generateDescription(type: ThreatData['type'], system: string): string {
    const descriptions = {
      anomaly: `Unusual behavior detected in ${system}. Pattern deviation from baseline metrics.`,
      unauthorized_access: `Unauthorized access attempt detected targeting ${system}.`,
      cyber_attack: `Potential cyber attack targeting ${system}. Multiple security policy violations detected.`,
      intrusion: `Security breach detected in ${system}. Suspicious activity patterns observed.`
    };
    return descriptions[type];
  }

  private generateRecommendations(type: ThreatData['type']): string[] {
    const commonRecommendations = [
      'Initiate immediate security scan',
      'Review access logs',
      'Update security protocols'
    ];

    const specificRecommendations = {
      anomaly: [
        'Analyze system baseline metrics',
        'Check for system updates',
        'Review recent configuration changes'
      ],
      unauthorized_access: [
        'Reset affected credentials',
        'Enable two-factor authentication',
        'Review access control lists'
      ],
      cyber_attack: [
        'Isolate affected systems',
        'Deploy countermeasures',
        'Notify security team'
      ],
      intrusion: [
        'Block suspicious IPs',
        'Enable enhanced monitoring',
        'Review firewall rules'
      ]
    };

    return [...commonRecommendations, ...specificRecommendations[type]];
  }
}

export const alertGenerator = new AlertGenerator();