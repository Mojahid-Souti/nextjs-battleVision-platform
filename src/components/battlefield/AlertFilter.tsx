// src/components/battlefield/AlertFilters.tsx
import React from 'react';
import { Filter } from 'lucide-react';
import { AlertSeverity } from '@/types/monitoring';

interface AlertFiltersProps {
  selectedSeverity: AlertSeverity | 'all';
  onSeverityChange: (severity: AlertSeverity | 'all') => void;
}

export const AlertFilters: React.FC<AlertFiltersProps> = ({
  selectedSeverity,
  onSeverityChange
}) => {
  const severities: (AlertSeverity | 'all')[] = ['all', 'critical', 'high', 'medium', 'low'];

  return (
    <div className="flex items-center gap-2 p-2 mb-4 rounded-lg bg-white/50">
      <Filter className="w-4 h-4 text-gray-500" />
      <div className="flex gap-1">
        {severities.map(severity => (
          <button
            key={severity}
            onClick={() => onSeverityChange(severity)}
            className={`px-2 py-1 text-xs rounded-full transition-all
              ${selectedSeverity === severity 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};