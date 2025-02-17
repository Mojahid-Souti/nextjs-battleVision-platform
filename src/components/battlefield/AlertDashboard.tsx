// src/components/battlefield/AlertDashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { SecurityAlert, ThreatPrediction, AlertSeverity } from '@/types/monitoring';
import { monitoringService } from '@/services/MonitoringService';
import { aiAnalysisService } from '@/services/AIAnalysisService';
import { AlertSummary } from './AlertSummary';
import { AlertCard } from './AlertCard';
import useSound from 'use-sound';
import { Volume2, VolumeX } from 'lucide-react';

// AlertFilters Component
interface AlertFiltersProps {
  selectedSeverity: AlertSeverity | 'all';
  onSeverityChange: (severity: AlertSeverity | 'all') => void;
}

const AlertFilters: React.FC<AlertFiltersProps> = ({
  selectedSeverity,
  onSeverityChange
}) => {
  const severities: (AlertSeverity | 'all')[] = ['all', 'critical', 'high', 'medium', 'low'];

  return (
    <div className="flex items-center gap-2 p-2 mb-4 rounded-lg bg-white/50">
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

export const AlertDashboard: React.FC = () => {
    const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
    const [predictions, setPredictions] = useState<Record<string, ThreatPrediction>>({});
    const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all');
    const [newAlertIds, setNewAlertIds] = useState<Set<string>>(new Set());
    const [soundEnabled, setSoundEnabled] = useState(true);

     // Sound hooks for different severity levels
  const [playCritical] = useSound('/sounds/critical-alert.mp3', { 
    volume: 0.5,
    interrupt: true 
  });
  const [playHigh] = useSound('/sounds/high-alert.mp3', { 
    volume: 0.4,
    interrupt: true 
  });
  const [playMedium] = useSound('/sounds/medium-alert.mp3', { 
    volume: 0.3,
    interrupt: true 
  });

  const playAlertSound = useCallback((severity: AlertSeverity) => {
    if (!soundEnabled) return;

    switch (severity) {
      case 'critical':
        playCritical();
        break;
      case 'high':
        playHigh();
        break;
      case 'medium':
        playMedium();
        break;
      default:
        // No sound for low severity
        break;
    }
  }, [soundEnabled, playCritical, playHigh, playMedium]);

    const handleNewAlert = useCallback(async (alert: SecurityAlert) => {
      setAlerts(prev => [alert, ...prev]);
      setNewAlertIds(prev => new Set(prev).add(alert.id));
  
      // Play sound based on severity
      playAlertSound(alert.severity);
      // Remove new alert highlight after 5 seconds
      setTimeout(() => {
        setNewAlertIds(prev => {
          const next = new Set(prev);
          next.delete(alert.id);
          return next;
        });
      }, 5000);
  
      try {
        const prediction = await aiAnalysisService.analyzeThreat(alert);
        setPredictions(prev => ({
          ...prev,
          [alert.id]: prediction
        }));
      } catch (error) {
        console.error('Error getting AI analysis:', error);
      }
    }, [playAlertSound]);
  
    useEffect(() => {
      const subscription = monitoringService.onAlert(handleNewAlert);
      return () => subscription.unsubscribe();
    }, [handleNewAlert]);
  
    const filteredAlerts = alerts.filter(alert => 
      selectedSeverity === 'all' || alert.severity === selectedSeverity
    );
  
    return (
      <div className="fixed right-4 top-24 w-96 max-h-[calc(100vh-120px)] bg-white/50 backdrop-blur-sm rounded-lg shadow-lg">
        <div className="sticky top-0 z-10 p-4 border-b bg-white/90 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Security Alerts</h2>
            <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              title={soundEnabled ? 'Disable alert sounds' : 'Enable alert sounds'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-gray-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-400" />
              )}
            </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                Live Updates
              </span>
            </div>
          </div>
          <AlertSummary alerts={alerts} />
          <AlertFilters
            selectedSeverity={selectedSeverity}
            onSeverityChange={setSelectedSeverity}
          />
        </div>
        
        <div className="p-4 overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No active alerts
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <AlertCard 
                key={alert.id} 
                alert={alert}
                prediction={predictions[alert.id]}
                isNew={newAlertIds.has(alert.id)}
              />
            ))
          )}
        </div>
      </div>
    );
  };
