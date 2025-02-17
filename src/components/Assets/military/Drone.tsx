// src/components/Assets/military/Drone.tsx
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Coordinate } from '@/types/military';

interface DroneProps {
  id: string;
  position: Coordinate;
  map: mapboxgl.Map;
  status?: 'operational' | 'critical' | 'warning';
}

export const Drone: React.FC<DroneProps> = ({ id, position, map, status = 'operational' }) => {
  useEffect(() => {
    if (!map) return;

    // Add source
    const source: GeoJSON.Feature<GeoJSON.Point> = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [position[1], position[0]]
      },
      properties: {
        id,
        type: 'drone',
        status
      }
    };

    map.addSource(`drone-${id}`, {
      type: 'geojson',
      data: source
    });

    // Add diamond shape
    map.addLayer({
      id: `drone-${id}-shape`,
      type: 'symbol',
      source: `drone-${id}`,
      layout: {
        'icon-image': 'diamond-1',
        'icon-size': 1,
        'icon-rotation-alignment': 'map',
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
      },
      paint: {
        'icon-color': [
          'match',
          ['get', 'status'],
          'operational', '#3b82f6',
          'warning', '#f59e0b',
          'critical', '#ef4444',
          '#3b82f6'
        ],
        'icon-opacity': 0.9
      }
    });

    // Add glow effect
    map.addLayer({
      id: `drone-${id}-glow`,
      type: 'circle',
      source: `drone-${id}`,
      paint: {
        'circle-radius': 15,
        'circle-color': '#3b82f6',
        'circle-opacity': 0.2,
        'circle-blur': 1
      }
    });

    // Add click handler for popup
    map.on('click', `drone-${id}-shape`, () => {
      new mapboxgl.Popup()
        .setLngLat([position[1], position[0]])
        .setHTML(`
          <div class="p-4 bg-white/95 backdrop-blur shadow-lg rounded-lg min-w-[240px]">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-base font-semibold text-gray-900">Drone ${id}</h3>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">Operational</span>
                <div class="h-2 w-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Battery Level</span>
                <span class="font-medium text-gray-900">82%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Altitude</span>
                <span class="font-medium text-gray-900">150m</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Last Update</span>
                <span class="font-medium text-gray-900">Just now</span>
              </div>
            </div>
          </div>
        `)
        .addTo(map);
    });

    return () => {
      if (map.getLayer(`drone-${id}-shape`)) map.removeLayer(`drone-${id}-shape`);
      if (map.getLayer(`drone-${id}-glow`)) map.removeLayer(`drone-${id}-glow`);
      if (map.getSource(`drone-${id}`)) map.removeSource(`drone-${id}`);
    };
  }, [map, id, position, status]);

  return null;
};

export default Drone;