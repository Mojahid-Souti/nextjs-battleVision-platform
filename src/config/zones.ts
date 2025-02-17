// src/config/zones.ts
import { Coordinate } from "@/types/military";

export const OMAN_SURVEILLANCE_ZONES: Record<string, SurveillanceZone> = {
  MUSCAT: {
    id: 'muscat-zone',
    name: 'Muscat City',
    center: [58.4159, 23.5957],
    coordinates: [
      [58.4038, 23.5835],
      [58.4102, 23.5921],
      [58.4189, 23.6012],
      [58.4359, 23.6137],
      [58.4481, 23.6109],
      [58.4392, 23.5901],
      [58.4256, 23.5843],
      [58.4038, 23.5835]
    ],
    style: {
      fillColor: '#3B82F6',
      fillOpacity: 0.1,
      hoverColor: '#EF4444',
      hoverOpacity: 0.3,
      borderColor: '#2563EB',
      borderWidth: 2,
      borderGlow: '#3B82F6'
    },
    assetDistribution: {
      drones: 2,
      sensors: 2
    }
  },

  AL_KHOUDH: {
    id: 'khoudh-zone',
    name: 'Al Khoudh',
    center: [58.1792, 23.5928],
    coordinates: [
      [58.1642, 23.5928],
      [58.1742, 23.5978],
      [58.1892, 23.5968],
      [58.1942, 23.5928],
      [58.1892, 23.5878],
      [58.1792, 23.5858],
      [58.1692, 23.5878],
      [58.1642, 23.5928]
    ],
    style: {
      fillColor: '#10B981',
      fillOpacity: 0.1,
      hoverColor: '#EF4444',
      hoverOpacity: 0.3,
      borderColor: '#059669',
      borderWidth: 2,
      borderGlow: '#10B981'
    },
    assetDistribution: {
      drones: 2,
      sensors: 2
    }
  }
};

// Update the types
export interface ZoneStyle {
  fillColor: string;
  fillOpacity: number;
  hoverColor: string;
  hoverOpacity: number;
  borderColor: string;
  borderWidth: number;
  borderGlow: string;
}

export interface AssetDistribution {
  drones: number;
  sensors: number;
}

export interface SurveillanceZone {
  id: string;
  name: string;
  center: Coordinate;
  coordinates: Coordinate[];
  style: ZoneStyle;
  assetDistribution: AssetDistribution;
}