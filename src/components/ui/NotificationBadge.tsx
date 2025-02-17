// src/components/ui/NotificationBadge.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface NotificationBadgeProps {
  count: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full -top-2 -right-2"
    >
      {count > 9 ? '9+' : count}
    </motion.div>
  );
};