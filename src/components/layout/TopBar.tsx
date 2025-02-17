// src/components/layout/TopBar.tsx
import { Shield } from 'lucide-react';

export const TopBar = () => {
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Shield className="h-8 w-8 text-blue-600" />
        <span className="text-xl font-bold">BattleVision</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Live Status</span>
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      </div>
    </header>
  );
};