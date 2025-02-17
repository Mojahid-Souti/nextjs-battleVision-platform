// src/components/battlefield/AlertCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { SecurityAlert, ThreatPrediction } from '@/types/monitoring';

interface AlertCardProps {
  alert: SecurityAlert;
  prediction?: ThreatPrediction;
  isNew?: boolean;
}

const severityColors = {
  critical: {
    border: '#ef4444',
    bg: 'bg-red-50',
    text: 'text-red-600'
  },
  high: {
    border: '#f59e0b',
    bg: 'bg-amber-50',
    text: 'text-amber-600'
  },
  medium: {
    border: '#3b82f6',
    bg: 'bg-blue-50',
    text: 'text-blue-600'
  },
  low: {
    border: '#10b981',
    bg: 'bg-green-50',
    text: 'text-green-600'
  }
};

export const AlertCard: React.FC<AlertCardProps> = ({ alert, isNew }) => (
  <motion.div
    initial={isNew ? { opacity: 0, y: -20 } : false}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className={`
      p-4 mb-4 transition-all border-l-4 
      bg-white/95 backdrop-blur-sm hover:shadow-lg
      ${isNew ? 'ring-2 ring-blue-200 ring-opacity-50' : ''}
    `}
    style={{ borderLeftColor: severityColors[alert.severity].border }}
    >
      {/* ... Rest of your existing AlertCard content ... */}
    </Card>
  </motion.div>
);