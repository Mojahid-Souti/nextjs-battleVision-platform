// src/components/battlefield/AlertSummary.tsx
import React from 'react';
import { SecurityAlert } from '@/types/monitoring';

interface AlertSummaryProps {
  alerts: SecurityAlert[];
}

export const AlertSummary: React.FC<AlertSummaryProps> = ({ alerts }) => {
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;

  return (
    <div className="flex gap-4 p-4 mb-4 rounded-lg shadow-sm bg-white/80">
      <div className="flex-1 text-center">
        <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
        <div className="text-xs text-gray-600">Critical</div>
      </div>
      <div className="flex-1 text-center">
        <div className="text-2xl font-bold text-amber-600">{highCount}</div>
        <div className="text-xs text-gray-600">High</div>
      </div>
      <div className="flex-1 text-center">
        <div className="text-2xl font-bold text-blue-600">{alerts.length}</div>
        <div className="text-xs text-gray-600">Total</div>
      </div>
    </div>
  );
};