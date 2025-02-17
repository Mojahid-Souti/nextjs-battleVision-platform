// src/components/LiveMonitor/AINetworkVisualizer.tsx
import { motion } from 'framer-motion';
import { Network, Cpu } from 'lucide-react';

export const AINetworkVisualizer = () => {
  const NUM_NODES = 6;
  const ORBIT_RADIUS = 150;
  const ORBIT_HEIGHT = 80;

  return (
    <div className="relative h-48 mb-8 overflow-hidden">
      {/* Central AI Node */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
        <motion.div 
          className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full"
          animate={{
            boxShadow: [
              '0 0 20px rgba(59, 130, 246, 0.5)',
              '0 0 40px rgba(59, 130, 246, 0.3)',
              '0 0 20px rgba(59, 130, 246, 0.5)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Cpu className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      {/* IoT Device Nodes */}
      {[...Array(NUM_NODES)].map((_, i) => {
        const angle = (i * Math.PI * 2) / NUM_NODES;
        const x = Math.cos(angle) * ORBIT_RADIUS + 50;
        const y = Math.sin(angle) * ORBIT_HEIGHT + 50;

        return (
          <motion.div
            key={i}
            className="absolute flex items-center justify-center w-8 h-8 bg-gray-700 rounded-lg"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 0 0 rgba(59, 130, 246, 0)',
                '0 0 20px rgba(59, 130, 246, 0.3)',
                '0 0 0 0 rgba(59, 130, 246, 0)',
              ]
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
            }}
          >
            <Network className="w-4 h-4 text-blue-400" />
          </motion.div>
        );
      })}

      {/* Signal Pulses */}
      {[...Array(NUM_NODES)].map((_, i) => {
        const angle = (i * Math.PI * 2) / NUM_NODES;
        const endX = Math.cos(angle) * ORBIT_RADIUS + 50;
        const endY = Math.sin(angle) * ORBIT_HEIGHT + 50;

        return (
          <motion.div
            key={`pulse-${i}`}
            className="absolute w-2 h-2 bg-blue-400 rounded-full left-1/2 top-1/2"
            animate={{
              x: ['0%', `${endX - 50}%`],
              y: ['0%', `${endY - 50}%`],
              scale: [1, 0],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
};