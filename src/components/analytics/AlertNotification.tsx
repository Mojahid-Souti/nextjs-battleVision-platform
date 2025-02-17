// src/components/analytics/AlertNotification.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface AlertNotificationProps {
  alerts: Array<{
    id: string;
    type: string;
    severity: string;
    location: string;
    timestamp: Date;
  }>;
  onDismiss: (id: string) => void;
}

export const AlertNotification: React.FC<AlertNotificationProps> = ({ alerts, onDismiss }) => {
  return (
    <div className="fixed z-50 space-y-2 top-4 right-4 w-96">
      <AnimatePresence>
        {alerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="p-4 border-l-4 border-red-500 rounded-lg shadow-lg bg-red-50"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="font-medium text-red-800">Critical Alert</h3>
                  <p className="mt-1 text-sm text-red-700">
                    {alert.type} detected in {alert.location}
                  </p>
                  <p className="mt-1 text-xs text-red-600">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDismiss(alert.id)}
                className="text-red-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};