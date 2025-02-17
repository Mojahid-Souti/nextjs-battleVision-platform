// src/data/threatData.ts
import { ThreatData, ThreatPatterns } from '@/types/analytics';

export const historicalThreats: ThreatData[] = [
  {
    id: '1',
    timestamp: new Date('2024-01-01'),
    type: 'cyber_attack',
    severity: 'critical',
    location: 'Muscat Zone',
    detectionScore: 0.92,
    confidence: 0.89,
    status: 'resolved'
  },
  {
    id: '2',
    timestamp: new Date('2024-01-02'),
    type: 'intrusion',
    severity: 'high',
    location: 'Matrah Zone',
    detectionScore: 0.85,
    confidence: 0.88,
    status: 'mitigated'
  },
  {
    id: '3',
    timestamp: new Date('2024-01-03'),
    type: 'anomaly',
    severity: 'medium',
    location: 'Sohar Zone',
    detectionScore: 0.78,
    confidence: 0.82,
    status: 'detected'
  }
];

export const threatPatterns: ThreatPatterns = {
  cyber_attack: {
    patterns: [
      'Unusual network traffic spike',
      'Multiple failed authentication attempts',
      'Suspicious data exfiltration',
      'Port scanning activity'
    ],
    indicators: {
      high: ['Multiple IPs blocked', 'System crashes'],
      medium: ['Failed logins', 'Configuration changes'],
      low: ['Minor anomalies', 'Timeout errors']
    }
  },
  intrusion: {
    patterns: [
      'Physical barrier breach',
      'Unauthorized access detected',
      'Security checkpoint violation',
      'Perimeter sensor alert'
    ],
    indicators: {
      high: ['Multiple zone breaches', 'Camera system tampering'],
      medium: ['Single zone violation', 'Sensor malfunction'],
      low: ['Unverified movement', 'Equipment misplacement']
    }
  }
};