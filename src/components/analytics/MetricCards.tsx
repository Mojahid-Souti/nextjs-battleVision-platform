// src/components/analytics/MetricCards.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Activity, 
  TrendingUp, Clock, Database 
} from 'lucide-react';
import { MetricData } from '@/types/analytics';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricCardsProps {
  metrics: MetricData;
}

interface DetailedMetric {
  current: number;
  previous: number;
  trend: number;
  history: number[];
}

interface ExtendedMetricData extends MetricData {
  avgResponseTime: DetailedMetric;
  systemUptime: DetailedMetric;
  networkLoad: DetailedMetric;
  threatHistory: DetailedMetric;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const extendedMetrics: ExtendedMetricData = {
    ...metrics,
    avgResponseTime: {
      current: 250, // ms
      previous: 280,
      trend: -10.7,
      history: [280, 275, 260, 250]
    },
    systemUptime: {
      current: 99.98,
      previous: 99.95,
      trend: 0.03,
      history: [99.95, 99.96, 99.97, 99.98]
    },
    networkLoad: {
      current: 45,
      previous: 52,
      trend: -13.5,
      history: [52, 48, 46, 45]
    },
    threatHistory: {
      current: metrics.totalThreats,
      previous: metrics.totalThreats - 5,
      trend: ((metrics.totalThreats - (metrics.totalThreats - 5)) / (metrics.totalThreats - 5)) * 100,
      history: [metrics.totalThreats - 15, metrics.totalThreats - 10, metrics.totalThreats - 5, metrics.totalThreats]
    }
  };

  const cards = [
    {
      id: 'total-threats',
      title: 'Total Threats',
      value: metrics.totalThreats,
      icon: Activity,
      color: 'blue',
      trend: {
        value: `${extendedMetrics.threatHistory.trend.toFixed(1)}%`,
        label: 'from last hour',
        isPositive: false
      },
      details: {
        label: 'Threat Distribution',
        value: `${metrics.criticalThreats} Critical, ${
          metrics.totalThreats - metrics.criticalThreats
        } Normal`,
        chart: extendedMetrics.threatHistory.history
      }
    },
    {
      id: 'response-time',
      title: 'Avg Response Time',
      value: `${extendedMetrics.avgResponseTime.current}ms`,
      icon: Clock,
      color: 'amber',
      trend: {
        value: `${extendedMetrics.avgResponseTime.trend}%`,
        label: 'improvement',
        isPositive: true
      },
      details: {
        label: 'Response Time Trend',
        value: 'Consistently improving',
        chart: extendedMetrics.avgResponseTime.history
      }
    },
    {
      id: 'system-health',
      title: 'System Health',
      value: `${extendedMetrics.systemUptime.current}%`,
      icon: Database,
      color: 'green',
      trend: {
        value: `${extendedMetrics.systemUptime.trend}%`,
        label: 'uptime increase',
        isPositive: true
      },
      details: {
        label: 'System Metrics',
        value: 'All systems operational',
        chart: extendedMetrics.systemUptime.history
      }
    },
    {
      id: 'network-load',
      title: 'Network Load',
      value: `${extendedMetrics.networkLoad.current}%`,
      icon: TrendingUp,
      color: 'purple',
      trend: {
        value: `${extendedMetrics.networkLoad.trend}%`,
        label: 'current usage',
        isPositive: extendedMetrics.networkLoad.trend < 0
      },
      details: {
        label: 'Load Distribution',
        value: 'Normal operating range',
        chart: extendedMetrics.networkLoad.history
      }
    }
  ];

  const MiniChart: React.FC<{ data: number[], color: string }> = ({ data, color }) => (
    <div className="h-8 flex items-end gap-0.5">
      {data.map((value, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{ height: `${(value / Math.max(...data)) * 100}%` }}
          className={`w-1 bg-${color}-500 rounded-t`}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => {
              setSelectedCard(selectedCard === card.id ? null : card.id);
              setIsExpanded(!isExpanded);
            }}
            className="cursor-pointer"
          >
            <Card className={`overflow-hidden transition-all duration-300 ${
              selectedCard === card.id ? 'ring-2 ring-blue-500' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h3 className="text-2xl font-bold tracking-tight">
                        {card.value}
                      </h3>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        card.trend.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {card.trend.value}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {card.trend.label}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-${card.color}-50 ring-1 ring-${card.color}-100/10`}>
                    <card.icon className={`w-5 h-5 text-${card.color}-600`} />
                  </div>
                </div>

                <AnimatePresence>
                  {selectedCard === card.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-4 mt-4 border-t"
                    >
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">
                          {card.details.label}
                        </p>
                        <p className="text-sm text-gray-700">
                          {card.details.value}
                        </p>
                        <MiniChart data={card.details.chart} color={card.color} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MetricCards;