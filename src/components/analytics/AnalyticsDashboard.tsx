// src/components/analytics/AnalyticsDashboard.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, VolumeX, Calendar, FileSpreadsheet,
  RefreshCw, AlertTriangle
} from 'lucide-react';
import { ThreatData, MetricData } from '@/types/analytics';
import { MetricCards } from './MetricCards';
import { ThreatActivityChart } from './charts/ThreatActivityChart';
import { AssetStatusChart } from './charts/AssetStatusChart';
import { ThreatTable } from './ThreatTable';
import { alertGenerator } from '@/services/AlertGenerator';
import { calculateMetrics } from '@/utils/dataProcessing';
import useSound from 'use-sound';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { X } from 'lucide-react';

const TIME_RANGES = {
  '1d': 'Last 24 Hours',
  '1w': 'Last Week',
  '1m': 'Last Month',
  '3m': 'Last 3 Months',
  '90d': 'Last 90 Days'
} as const;

type TimeRangeKey = keyof typeof TIME_RANGES;

export const AnalyticsDashboard: React.FC = () => {
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [notifications, setNotifications] = useState<ThreatData[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('90d');
  const [metrics, setMetrics] = useState<MetricData>({
    totalThreats: 0,
    criticalThreats: 0,
    resolvedThreats: 0,
    averageConfidence: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const handleDismissAlert = (threatId: string) => {
    setDismissedAlerts(prev => new Set([...prev, threatId]));
  };

  const [playCritical] = useSound('/sounds/critical-alert.mp3', { 
    volume: 0.5,
    soundEnabled
  });

  const handleNewThreat = useCallback((threat: ThreatData) => {
    setThreats(prev => {
      const newThreats = [threat, ...prev].slice(0, 100);
      // Now the property names match the MetricData interface
      const newMetrics = calculateMetrics(newThreats);
      setMetrics(newMetrics);
      return newThreats;
    });
  
    setNotifications(prev => [threat, ...prev].slice(0, 5));
  
    if (soundEnabled && threat.severity === 'critical') {
      playCritical();
    }
  }, [soundEnabled, playCritical]);

  const handleExport = useCallback(() => {
    const exportData = threats.map(threat => ({
      Time: format(new Date(threat.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      Type: threat.type,
      Severity: threat.severity,
      Location: threat.location,
      'Detection Score': `${threat.detectionScore}%`,
      'Confidence': `${threat.confidence}%`,
      Status: threat.status
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Threat Activity');
    XLSX.writeFile(wb, `threat-activity-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  }, [threats]);

  const filteredThreats = useMemo(() => {
    const cutoffDate = new Date();
    const days = parseInt(timeRange.replace(/\D/g, ''));
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return threats.filter(threat => new Date(threat.timestamp) >= cutoffDate);
  }, [threats, timeRange]);

  const handleThreatAction = useCallback((threatId: string, action: ThreatData['status']) => {
    setThreats(prev => prev.map(threat => 
      threat.id === threatId ? { ...threat, status: action } : threat
    ));
  }, []);

  useEffect(() => {
    const generateInitialThreats = async () => {
      setIsLoading(true);
      
      const criticalThreat = alertGenerator.generateThreat('critical');
      const initialThreats = [
        criticalThreat,
        ...Array.from({ length: 4 }, () => alertGenerator.generateThreat())
      ];
      
      initialThreats.forEach(handleNewThreat);
      setIsLoading(false);
    };

    generateInitialThreats();

    const interval = setInterval(() => {
      const shouldBeCritical = Math.random() < 0.2;
      const newThreat = alertGenerator.generateThreat(
        shouldBeCritical ? 'critical' : undefined
      );
      handleNewThreat(newThreat);
    }, 60000);

    return () => clearInterval(interval);
  }, [handleNewThreat]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    const newThreat = alertGenerator.generateThreat('critical');
    handleNewThreat(newThreat);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [handleNewThreat]);

  return (
    <motion.div 
      className="flex flex-col h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="px-8 py-6 bg-white border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              AI-Powered Threat Detection and Analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRangeKey)}
                className="text-sm bg-transparent border-none outline-none"
              >
                {Object.entries(TIME_RANGES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleExport}
              className="p-2 text-gray-500 bg-white border rounded-lg hover:bg-gray-50"
              title="Export to Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              className={`p-2 text-gray-500 bg-white border rounded-lg hover:bg-gray-50 
                ${isRefreshing ? 'animate-spin' : ''}`}
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-gray-500 bg-white border rounded-lg hover:bg-gray-50"
              title={soundEnabled ? 'Disable Alert Sounds' : 'Enable Alert Sounds'}
            >
              {soundEnabled ? 
                <Volume2 className="w-4 h-4" /> : 
                <VolumeX className="w-4 h-4" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex-1 space-y-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <MetricCards metrics={metrics} />
                <div className="grid grid-cols-2 gap-6">
                  <ThreatActivityChart data={filteredThreats} />
                  <AssetStatusChart data={filteredThreats} />
                </div>
                <ThreatTable 
                  threats={filteredThreats}
                  notifications={notifications}
                  onThreatAction={handleThreatAction}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Critical Alert Notification */}
      <AnimatePresence>
        {notifications
          .filter(threat => 
            threat.severity === 'critical' && 
            Date.now() - new Date(threat.timestamp).getTime() < 5000 &&
            !dismissedAlerts.has(threat.id)
          )
          .map(threat => (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed p-4 border-l-4 border-red-500 rounded-lg shadow-lg bottom-4 right-4 bg-red-50"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="pr-6 font-medium text-red-800">Critical Alert Detected</h3>
                  <p className="text-sm text-red-600">
                    {threat.details.description || 'New critical security threat requires immediate attention'}
                  </p>
                  <div className="mt-2 text-xs text-red-500">
                    {format(new Date(threat.timestamp), 'HH:mm:ss')} - {threat.location}
                  </div>
                </div>
                <button
                  onClick={() => handleDismissAlert(threat.id)}
                  className="text-red-500 transition-colors hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnalyticsDashboard;