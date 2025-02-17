// src/data/sampleThreatData.ts
import { format, subDays } from 'date-fns';
import { ThreatData } from '@/types/analytics';

export const generateSampleThreatData = (): ThreatData[] => {
  const data: ThreatData[] = [];
  const now = new Date();
  
  // Generate data for last 90 days
  for (let i = 90; i >= 0; i--) {
    const date = subDays(now, i);
    // Generate 5-15 threats per day
    const numThreats = Math.floor(Math.random() * 10) + 5;
    
    for (let j = 0; j < numThreats; j++) {
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const timestamp = new Date(date);
      timestamp.setHours(hour, minute);

      // Increase probability of certain threats based on time patterns
      let type = 'cyber_attack';
      const rand = Math.random();
      if (hour < 6) { // Night time - more unauthorized access
        type = rand < 0.4 ? 'unauthorized_access' : 
               rand < 0.7 ? 'intrusion' :
               rand < 0.9 ? 'anomaly' : 'cyber_attack';
      } else if (hour >= 9 && hour <= 17) { // Business hours - more cyber attacks
        type = rand < 0.4 ? 'cyber_attack' :
               rand < 0.7 ? 'anomaly' :
               rand < 0.9 ? 'intrusion' : 'unauthorized_access';
      }

      data.push({
        id: `${format(timestamp, 'yyyyMMddHHmm')}-${j}`,
        timestamp,
        type: type as any,
        severity: rand < 0.1 ? 'critical' :
                 rand < 0.3 ? 'high' :
                 rand < 0.7 ? 'medium' : 'low',
        location: ['Muscat Zone', 'Matrah Zone', 'Sohar Zone', 'Sur Zone'][
          Math.floor(Math.random() * 4)
        ],
        detectionScore: 0.7 + (Math.random() * 0.3), // 70-100%
        confidence: 0.8 + (Math.random() * 0.2), // 80-100%
        status: rand < 0.2 ? 'detected' :
                rand < 0.5 ? 'analyzing' :
                rand < 0.8 ? 'mitigated' : 'resolved'
      });
    }
  }

  return data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};