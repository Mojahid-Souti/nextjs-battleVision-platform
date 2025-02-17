// src/utils/constants.ts
export const CHART_COLORS = {
    cyberAttacks: '#3b82f6',
    intrusions: '#8b5cf6',
    anomalies: '#f59e0b',
    operational: '#22c55e',
    warning: '#f59e0b',
    critical: '#ef4444'
  } as const;
  
  export const SEVERITY_STYLES = {
    critical: 'bg-red-50 text-red-600',
    high: 'bg-orange-50 text-orange-600',
    medium: 'bg-yellow-50 text-yellow-600',
    low: 'bg-green-50 text-green-600'
  } as const;