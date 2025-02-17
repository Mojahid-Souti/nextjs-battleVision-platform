// src/config/assets.ts
import { Asset, AssetType } from '@/types/military';
import tankIcon from '@/assets/icons/tank.png';
import droneIcon from '@/assets/icons/drone.png';
import planeIcon from '@/assets/icons/plane.png';
import sensorIcon from '@/assets/icons/sensor.png';

export interface AssetDefinition {
  type: AssetType;
  icon: string;
  color: string;
  glowColor: string;
}

// Single definition of ASSET_TYPES combining both versions
export const ASSET_TYPES: Record<AssetType, AssetDefinition> = {
  tank: {
    type: 'tank',
    icon: tankIcon,  // Using imported icon
    color: '#22c55e', // green
    glowColor: 'rgba(34, 197, 94, 0.5)'
  },
  drone: {
    type: 'drone',
    icon: droneIcon,  // Using imported icon
    color: '#3b82f6', // blue
    glowColor: 'rgba(59, 130, 246, 0.5)'
  },
  plane: {
    type: 'plane',
    icon: planeIcon,  // Using imported icon
    color: '#8b5cf6', // purple
    glowColor: 'rgba(139, 92, 246, 0.5)'
  },
  sensor: {
    type: 'sensor',
    icon: sensorIcon,  // Using imported icon
    color: '#f59e0b', // amber
    glowColor: 'rgba(245, 158, 11, 0.5)'
  }
} as const;

// Initial asset distribution
export const INITIAL_ASSETS: Record<string, Asset[]> = {
  'muscat-zone': [
    { id: 'tank-1', type: 'tank', position: [58.4159, 23.5957] },
    { id: 'drone-1', type: 'drone', position: [58.4189, 23.6012] },
    { id: 'plane-1', type: 'plane', position: [58.4256, 23.5843] }
  ],
  'khoudh-zone': [
    { id: 'tank-2', type: 'tank', position: [58.1792, 23.5928] },
    { id: 'drone-2', type: 'drone', position: [58.1842, 23.5978] }
  ]
};

// Helper functions
export const getAssetDefinition = (type: AssetType): AssetDefinition => {
  return ASSET_TYPES[type];
};

export const createAsset = (
  type: AssetType,
  position: [number, number]
): Asset => {
  return {
    id: `${type}-${Date.now()}`,
    type,
    position
  };
};