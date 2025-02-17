// src/components/layout/MainLayout.tsx
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import BattleFieldMap from '@/components/battlefield/BattlefieldMap';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { LiveMonitor } from '@/components/LiveMonitor/LiveMonitor';
import Communications from '../aiAnalyzing/Communications';

export const MainLayout = () => {
  const [currentPath, setCurrentPath] = useState('/map');

  const renderContent = () => {
    switch (currentPath) {
      case '/map':
        return <BattleFieldMap />;
      case '/analytics':
        return <AnalyticsDashboard />;
      case '/monitor':
        return <LiveMonitor />;
      case '/comms':
        return <Communications />;
      case '/settings':
        return <div>Settings Coming Soon</div>;
      default:
        return <BattleFieldMap />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar activeItem={currentPath} setActiveItem={setCurrentPath} />
      <div className="flex-1 h-full overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};