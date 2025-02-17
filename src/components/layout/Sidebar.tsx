// src/components/layout/Sidebar.tsx
import { 
  Map, 
  BarChart2, 
  Settings, 
  Radio,
  Shield,
  Radar
} from 'lucide-react';
import {
  TooltipProvider,
} from "@/components/ui/tooltip";

const menuItems = [
  { icon: Map, label: 'Battlefield Map', path: '/map' },
  { icon: Radar, label: 'Live Monitor', path: '/monitor' },
  { icon: Radio, label: 'BattleVision AI', path: '/comms' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  activeItem: string;
  setActiveItem: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, setActiveItem }) => {
  return (
    <aside className="bg-white border-r border-gray-200 w-72">
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl shadow-lg bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700">
              <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-['Audiowide'] text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 bg-clip-text">
              BattleVision
            </span>
          </div>
        </div>

        <nav className="space-y-2">
          <TooltipProvider>
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => setActiveItem(item.path)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl w-full transition-all duration-200
                  ${activeItem === item.path 
                    ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <item.icon 
                  className="flex-shrink-0 w-6 h-6" 
                  strokeWidth={activeItem === item.path ? 2.5 : 2} 
                />
                <span className="font-medium">{item.label}</span>
                {activeItem === item.path && (
                  <div className="w-2 h-2 ml-auto bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </TooltipProvider>
        </nav>
      </div>
    </aside>
  );
};