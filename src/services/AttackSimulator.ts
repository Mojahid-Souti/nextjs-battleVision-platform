// src/services/AttackSimulator.ts
import { Attack, AttackType, AttackStatus, ThreatLevel } from '@/types/military';

class AttackSimulator {
  private static instance: AttackSimulator;
  private activeAttacks: Attack[] = [];

  static getInstance(): AttackSimulator {
    if (!this.instance) {
      this.instance = new AttackSimulator();
    }
    return this.instance;
  }

  constructor() {
    // Initialize with some mock attacks
    this.generateMockAttacks();
    // Generate new attacks periodically
    setInterval(() => this.generateMockAttacks(), 30000);
  }

  private generateMockAttacks() {
    const attackTypes: AttackType[] = ['DDoS', 'MitM', 'Spoofing', 'Jamming'];
    const threatLevels: ThreatLevel[] = ['low', 'medium', 'high', 'critical'];
    const statuses: AttackStatus[] = ['preparing', 'ongoing', 'detected', 'mitigated'];

    // Generate 1-3 random attacks
    const numAttacks = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numAttacks; i++) {
      const attack: Attack = {
        id: `attack-${Date.now()}-${i}`,
        type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
        source: [58.1742, 23.5928], // Al Khoudh coordinates
        target: [58.4159, 23.5957], // Muscat coordinates
        intensity: Math.floor(Math.random() * 10) + 1,
        startTime: Date.now(),
        duration: Math.random() * 60000, // Random duration up to 1 minute
        status: statuses[Math.floor(Math.random() * statuses.length)],
        threatLevel: threatLevels[Math.floor(Math.random() * threatLevels.length)]
      };

      this.activeAttacks.push(attack);
    }

    // Clean up old attacks
    this.activeAttacks = this.activeAttacks.slice(-5); // Keep only last 5 attacks
  }

  getActiveAttacks(): Attack[] {
    return this.activeAttacks;
  }

  addAttack(attack: Attack) {
    this.activeAttacks.push(attack);
  }
}

export const attackSimulator = AttackSimulator.getInstance();