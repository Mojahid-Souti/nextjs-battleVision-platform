// src/components/LiveMonitor/AIDefenseSystem.tsx
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export const AIDefenseSystem = () => (
  <div className="relative">
    {/* Core System Ring */}
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
    
    {/* Status Indicator */}
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
