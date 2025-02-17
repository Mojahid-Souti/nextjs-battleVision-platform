// src/services/MonitoringService.ts
import { Subject } from 'rxjs';
import { SecurityAlert, AssetStatus, AlertType } from '@/types/monitoring';

class MonitoringService {
  private alerts$ = new Subject<SecurityAlert>();
  private assetUpdates$ = new Subject<AssetStatus>();
  private activeAlerts: Map<string, SecurityAlert> = new Map();
  private updateInterval: number = 120000; // 2 minutes

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring(): void {
    setInterval(() => this.simulateUpdates(), this.updateInterval);
  }

  private simulateUpdates(): void {
    if (Math.random() > 0.7) { // 30% chance of new alert
      const alert = this.generateAlert();
      this.activeAlerts.set(alert.id, alert);
      this.alerts$.next(alert);
    }
  }

  private generateAlert(): SecurityAlert {
    const types: AlertType[] = ['cyber_attack', 'intrusion', 'anomaly', 'unauthorized_access'];
    const locations = ['Muscat Zone', 'Matrah Zone', 'Sohar Zone'];
    
    return {
      id: crypto.randomUUID(),
      type: types[Math.floor(Math.random() * types.length)],
      severity: Math.random() > 0.7 ? 'critical' : 
                Math.random() > 0.5 ? 'high' : 
                Math.random() > 0.3 ? 'medium' : 'low',
      timestamp: new Date(),
      location: locations[Math.floor(Math.random() * locations.length)],
      description: this.generateDescription(),
      suggestedActions: this.generateSuggestedActions(),
      automaticResponses: this.generateAutomaticResponses(),
      status: 'detected'
    };
  }

  private generateDescription(): string {
    const descriptions = [
      'Unusual network traffic patterns detected',
      'Multiple failed authentication attempts',
      'Unexpected system behavior observed',
      'Security perimeter breach detected',
      'Communication anomalies identified'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private generateSuggestedActions(): string[] {
    const actions = [
      'Initiate security lockdown',
      'Verify system integrity',
      'Deploy countermeasures',
      'Isolate affected systems',
      'Activate backup protocols'
    ];
    return actions.slice(0, Math.floor(Math.random() * 3) + 2);
  }

  private generateAutomaticResponses(): string[] {
    const responses = [
      'Firewall rules updated',
      'Backup systems activated',
      'Security protocols enhanced',
      'Monitoring sensitivity increased',
      'Emergency protocols initiated'
    ];
    return responses.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  public onAlert(callback: (alert: SecurityAlert) => void) {
    return this.alerts$.subscribe(callback);
  }

  public onAssetUpdate(callback: (update: AssetStatus) => void) {
    return this.assetUpdates$.subscribe(callback);
  }

  public getActiveAlerts(): SecurityAlert[] {
    return Array.from(this.activeAlerts.values());
  }
}

export const monitoringService = new MonitoringService();