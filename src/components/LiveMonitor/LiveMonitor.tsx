// src/components/LiveMonitor/LiveMonitor.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Cpu, Network, Wifi, X, Radio, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Papa from 'papaparse';

interface AttackData {
  saddr: string;
  daddr: string;
  category: string;
  subcategory: string;
  attack: string;
  proto: string;
  bytes: number;
  state: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  source: string;
  target: string;
  timestamp: Date;
}

const AICopilot = () => (
  <div className="relative">
    <motion.div 
      className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
      animate={{
        boxShadow: [
          '0 0 0 0 rgba(59, 130, 246, 0.4)',
          '0 0 0 20px rgba(59, 130, 246, 0)',
        ],
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
      }}
    >
      <motion.div
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Cpu className="w-6 h-6 text-white" />
      </motion.div>
    </motion.div>
    <motion.div
      className="absolute w-4 h-4 bg-green-400 border-2 border-white rounded-full -top-1 -right-1"
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    />
  </div>
);

export const LiveMonitor: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [threatCount, setThreatCount] = useState(0);
  const [actionText, setActionText] = useState('Initializing AI Defense Systems...');

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const processAttack = useCallback((data: AttackData) => {
    const newNotification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      type: data.category.toLowerCase(),
      title: data.category,
      description: data.subcategory,
      source: data.saddr,
      target: data.daddr,
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 10));
    setThreatCount(prev => prev + 1);
    setActionText(`Analyzing ${data.category} attack pattern...`);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/Military_IoT_Attack_Dataset.csv');
        const text = await response.text();
        
        Papa.parse<AttackData>(text, {
          header: true,
          complete: (results) => {
            results.data
              .filter((row): row is AttackData => 
                row && typeof row.saddr === 'string' && 
                typeof row.category === 'string'
              )
              .forEach((row, index) => {
                setTimeout(() => processAttack(row), index * 2000);
              });
          }
        });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [processAttack]);

  
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {/* AI Status Header */}
      <Card className="mb-8 bg-gray-800 border-0">
        <div className="flex items-center gap-6 p-6">
          <AICopilot />
          <div className="flex-1">
            <motion.h2 
              key={actionText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-white"
            >
              {actionText}
            </motion.h2>
            <div className="flex items-center gap-2 mt-2">
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">
                Active Protection Enabled | {threatCount} threats detected
              </span>
            </div>
          </div>
        </div>
        <motion.div 
          className="h-1 bg-blue-500"
          animate={{
            width: ['0%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
      </Card>

      {/* Notification Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="overflow-hidden bg-white rounded-lg shadow-lg"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {notification.type === 'jamming' && (
                      <Radio className="w-5 h-5 text-red-500" />
                    )}
                    {notification.type === 'spoofing' && (
                      <Zap className="w-5 h-5 text-yellow-500" />
                    )}
                    {notification.type === 'replay attack' && (
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Network className="w-3 h-3" />
                    {notification.source} → {notification.target}
                  </div>
                  <div className="mt-1">
                    {notification.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="h-1 bg-red-500 animate-pulse" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveMonitor;