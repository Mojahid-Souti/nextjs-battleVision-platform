// src/components/battlefield/BattlefieldOverview.tsx
import { Search } from 'lucide-react';
import BattleFieldMap  from './BattlefieldMap';

const MetricCard = ({ title, value, trend }: {
  title: string;
  value: string;
  trend?: 'up' | 'down';
  status?: 'success' | 'warning' | 'danger';
}) => (
  <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
    <h3 className="mb-1 text-sm text-gray-600">{title}</h3>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-semibold">{value}</span>
      {trend && (
        <span className={`text-sm ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend === 'up' ? '↑' : '↓'}
        </span>
      )}
    </div>
  </div>
);

export const BattlefieldOverview = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Battlefield Overview</h1>
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search assets..."
            className="py-2 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard 
          title="Active Assets"
          value="24"
          trend="up"
        />
        <MetricCard 
          title="Coverage Area"
          value="12.5 km²"
        />
        <MetricCard 
          title="Critical Alerts"
          value="3"
          trend="down"
          status="danger"
        />
        <MetricCard 
          title="Asset Health"
          value="92%"
          status="success"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-[600px] overflow-hidden">
        <BattleFieldMap />
      </div>
    </div>
  );
};