// src/components/Assets/military/ZoneAssets.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import { SurveillanceZone } from '@/types/military';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";



// Type declarations
declare module 'mapbox-gl' {
  interface Marker {
    rootInstance?: ReturnType<typeof createRoot>;
  }
}

interface SensorInfo {
  id: string;
  strength: number;
  coverage: number;
  connections: number;
}

interface DroneInfo {
  id: string;
  speed: number;
  altitude: number;
  battery: number;
}

interface ZoneAssetsProps {
  zone: SurveillanceZone;
  map: mapboxgl.Map;
  selectedType?: string | null;
}

type Coordinate = [number, number];

interface ZoneConfig {
  sensors: Coordinate[];
  center: Coordinate;
  drones: Coordinate[];
}

type FixedPositionsMap = {
  [key in 'khoudh-zone' | 'muscat-zone']: ZoneConfig;
};


// Render helper with cleanup
const renderReactComponent = (component: React.ReactNode, container: HTMLElement) => {
  try {
    const root = createRoot(container);
    root.render(component);
    return root;
  } catch (error) {
    console.error('Error rendering React component:', error);
    return null;
  }
};

// Popover Components
const SensorPopover = ({ info }: { info: SensorInfo }) => (
  <PopoverContent className="w-[300px] p-0 bg-white/95 backdrop-blur-sm border-none shadow-2xl">
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">{info.id}</h4>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"/>
            <span className="ml-2 text-xs font-medium text-blue-600">Monitoring</span>
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Signal Strength
          </div>
          <span className="font-medium">{info.strength}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Coverage
          </div>
          <span className="font-medium">{info.coverage} km²</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Active Connections
          </div>
          <span className="font-medium">{info.connections}</span>
        </div>
      </div>
    </div>
  </PopoverContent>
);

const DronePopover = ({ info }: { info: DroneInfo }) => (
  <PopoverContent className="w-[300px] p-0 bg-white/95 backdrop-blur-sm border-none shadow-2xl">
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">{info.id}</h4>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
            <span className="ml-2 text-xs font-medium text-green-600">In Operation</span>
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-green-500">
            <path fill="currentColor" d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z"/>
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Speed
          </div>
          <span className="font-medium">{info.speed} km/h</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            Altitude
          </div>
          <span className="font-medium">{info.altitude} ft</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Battery
          </div>
          <span className="font-medium">{info.battery}%</span>
        </div>
      </div>
    </div>
  </PopoverContent>
);


// Main Component
export const ZoneAssets: React.FC<ZoneAssetsProps> = ({ zone, map, selectedType }) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const droneMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const lineLayersRef = useRef<Set<string>>(new Set());
  const animationFramesRef = useRef<number[]>([]);
  const mountedRef = useRef(true);

  const FIXED_POSITIONS: FixedPositionsMap = {
    'khoudh-zone': {
      sensors: [
        [58.1742, 23.5928],
        [58.1692, 23.5908],
        [58.1750, 23.5900]
      ],
      center: [58.1742, 23.5908],
      drones: [
        [58.1732, 23.5918],
        [58.1702, 23.5898],
        [58.1760, 23.5890]
      ]
    },
    'muscat-zone': {
      sensors: [
        [58.4159, 23.5957],
        [58.4209, 23.5937],
        [58.4259, 23.5917]
      ],
      center: [58.4209, 23.5937],
      drones: [
        [58.4149, 23.5947],
        [58.4199, 23.5927],
        [58.4249, 23.5907]
      ]
    }
  };

  const safeRemoveLayer = useCallback((id: string) => {
    try {
      if (map && map.getStyle()) {
        const layerIds = [
          id,
          `${id}-glow`,
          `${id}-animated`
        ];

        layerIds.forEach(layerId => {
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
        });

        if (map.getSource(id)) {
          map.removeSource(id);
        }
      }
    } catch (error) {
      console.warn(`Error removing layer ${id}:`, error);
    }
  }, [map]);


  const createNetworkLine = useCallback((fromPos: Coordinate, toPos: Coordinate) => {
    if (!mountedRef.current || !map || !map.getStyle()) return;

    const uniqueId = `network-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    lineLayersRef.current.add(uniqueId);

    try {
      // Add source
      map.addSource(uniqueId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [fromPos, toPos]
          }
        }
      });

      // Main persistent line
      map.addLayer({
        id: uniqueId,
        type: 'line',
        source: uniqueId,
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
          visibility: 'visible'
        },
        paint: {
          'line-color': zone.id === 'khoudh-zone' ? '#FF0000' : '#3B82F6',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });

      // Persistent glow effect
      map.addLayer({
        id: `${uniqueId}-glow`,
        type: 'line',
        source: uniqueId,
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': zone.id === 'khoudh-zone' ? '#FF0000' : '#3B82F6',
          'line-width': 8,
          'line-opacity': 0.2,
          'line-blur': 3
        }
      });

      // Animated pattern overlay
      map.addLayer({
        id: `${uniqueId}-animated`,
        type: 'line',
        source: uniqueId,
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#FFDD00',
          'line-width': 4,
          'line-opacity': 0.4,
          'line-dasharray': [1, 4]
        }
      });

      let offset = 0;
      const animate = () => {
        if (!mountedRef.current) return;
        
        try {
          offset = (offset + 0.5) % 6;
          if (map.getLayer(`${uniqueId}-animated`)) {
            map.setPaintProperty(`${uniqueId}-animated`, 'line-dasharray', [1, 4, offset]);
            const animFrame = requestAnimationFrame(animate);
            animationFramesRef.current.push(animFrame);
          }
        } catch (error) {
          console.warn('Animation error:', error);
        }
      };

      animate();

    } catch (error) {
      console.error('Error creating network line:', error);
      safeRemoveLayer(uniqueId);
      lineLayersRef.current.delete(uniqueId);
    }
  }, [map, zone.id, safeRemoveLayer]);

  const createSensor = useCallback((position: Coordinate, index: number) => {
    const el = document.createElement('div');
    el.className = 'relative flex items-center justify-center w-8 h-8';

    const popoverContainer = document.createElement('div');
    popoverContainer.className = 'sensor-popover-container';

    const root = renderReactComponent(
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative cursor-pointer group">
            <div className="absolute inset-0 bg-blue-900 rounded-full opacity-20"></div>
            <div className="relative flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full ring-2 ring-white">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </div>
            <div className="absolute -bottom-1 flex justify-center w-full gap-0.5">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </PopoverTrigger>
        <SensorPopover info={{
          id: `${zone.id}-sensor-${index + 1}`,
          strength: 98,
          coverage: 2.5,
          connections: 3
        }} />
      </Popover>,
      popoverContainer
    );

    if (!root) return null;

    el.appendChild(popoverContainer);

    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'center'
    })
    .setLngLat(position);

    marker.rootInstance = root;

    if (zone.id === 'khoudh-zone' && mountedRef.current) {
      const targetZone = FIXED_POSITIONS['muscat-zone'];
      targetZone.sensors.forEach((targetPos) => {
        setTimeout(() => {
          if (mountedRef.current) {
            createNetworkLine(position, targetPos);
          }
        }, Math.random() * 1000);
      });
    }

    marker.addTo(map);
    return marker;
  }, [map, zone.id, createNetworkLine]);

  const createDrone = useCallback((position: Coordinate, index: number) => {
    if (!mountedRef.current) return null;

    const el = document.createElement('div');
    el.className = 'relative w-6 h-6';

    const popoverContainer = document.createElement('div');
    popoverContainer.className = 'drone-popover-container';

    const root = renderReactComponent(
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative cursor-pointer group">
            <div className="absolute inset-0 bg-black rounded-full opacity-80"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                <path fill="currentColor" d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z"/>
              </svg>
            </div>
            <div className="absolute -bottom-1 flex justify-center w-full gap-0.5">
              <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </PopoverTrigger>
        <DronePopover info={{
          id: `${zone.id}-drone-${index + 1}`,
          speed: 120,
          altitude: 1500,
          battery: 85
        }} />
      </Popover>,
      popoverContainer
    );

    if (!root) return null;

    el.appendChild(popoverContainer);

    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'center'
    })
    .setLngLat(position);

    marker.rootInstance = root;
    marker.addTo(map);

    // Drone movement animation
    let pathIndex = 0;
    const radius = 0.002;
    const center = position;
    let lastPos = position;
    let currentTrailId: string | null = null;

    const animate = () => {
      if (!mountedRef.current) return;

      try {
        pathIndex = (pathIndex + 1) % 360;
        const angle = (pathIndex * Math.PI) / 180;
        
        const newPos: Coordinate = [
          center[0] + Math.cos(angle) * radius,
          center[1] + Math.sin(angle) * radius
        ];

        // Clean up previous trail
        if (currentTrailId) {
          safeRemoveLayer(currentTrailId);
        }

        // Create new trail
        currentTrailId = `trail-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        lineLayersRef.current.add(currentTrailId);

        if (map && map.getStyle()) {
          map.addSource(currentTrailId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [lastPos, newPos]
              }
            }
          });

          map.addLayer({
            id: currentTrailId,
            type: 'line',
            source: currentTrailId,
            paint: {
              'line-color': '#FF4444',
              'line-width': 3,
              'line-opacity': 0.8
            }
          });

          map.addLayer({
            id: `${currentTrailId}-glow`,
            type: 'line',
            source: currentTrailId,
            paint: {
              'line-color': '#FF4444',
              'line-width': 6,
              'line-opacity': 0.2,
              'line-blur': 3
            }
          });

          marker.setLngLat(newPos);
          lastPos = newPos;

          if (mountedRef.current) {
            const animFrame = requestAnimationFrame(() => setTimeout(animate, 50));
            animationFramesRef.current.push(animFrame);
          }
        }
      } catch (error) {
        console.warn('Drone animation error:', error);
      }
    };

    animate();
    return marker;
  }, [map, zone.id, safeRemoveLayer]);

  // Cleanup and effect
  useEffect(() => {
    mountedRef.current = true;

    const cleanup = () => {
      mountedRef.current = false;

      // Cancel all animations
      animationFramesRef.current.forEach(frame => cancelAnimationFrame(frame));
      animationFramesRef.current = [];

      // Clean up markers with their React roots
      markersRef.current.forEach(marker => {
        if (marker?.rootInstance) {
          marker.rootInstance.unmount();
        }
        marker?.remove();
      });
      markersRef.current = [];

      droneMarkersRef.current.forEach(marker => {
        if (marker?.rootInstance) {
          marker.rootInstance.unmount();
        }
        marker?.remove();
      });
      droneMarkersRef.current = [];

      // Clean up map layers
      lineLayersRef.current.forEach(id => {
        safeRemoveLayer(id);
      });
      lineLayersRef.current.clear();
    };

    // Initialize assets
    const initializeAssets = async () => {
      if (!map || !map.getStyle()) return;

      const zoneKey = zone.id as keyof typeof FIXED_POSITIONS;
      const zonePositions = FIXED_POSITIONS[zoneKey];
      
      if (!zonePositions) return;

      // Create sensors with delay
      for (let i = 0; i < zonePositions.sensors.length; i++) {
        if (!mountedRef.current) break;
        const marker = createSensor(zonePositions.sensors[i], i);
        if (marker) markersRef.current.push(marker);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create drones with delay
      for (let i = 0; i < zonePositions.drones.length; i++) {
        if (!mountedRef.current) break;
        const marker = createDrone(zonePositions.drones[i], i);
        if (marker) droneMarkersRef.current.push(marker);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    };

    initializeAssets();
    return cleanup;
  }, [zone, map, selectedType, createSensor, createDrone, safeRemoveLayer]);

  return null;
};

export default ZoneAssets;