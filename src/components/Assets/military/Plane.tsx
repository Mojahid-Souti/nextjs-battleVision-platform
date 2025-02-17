// src/components/Assets/military/Plane.tsx
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Coordinate } from '@/types/military';

interface PlaneProps {
  id: string;
  position: Coordinate;
  map: mapboxgl.Map;
  status?: 'operational' | 'critical' | 'warning';
}

export const Plane: React.FC<PlaneProps> = ({ id, position, map, status = 'operational' }) => {
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
        type: 'plane',
        status
      }
    };

    map.addSource(`plane-${id}`, {
      type: 'geojson',
      data: source
    });

    // Add triangle shape
    map.addLayer({
      id: `plane-${id}-shape`,
      type: 'symbol',
      source: `plane-${id}`,
      layout: {
        'icon-image': 'triangle-12',
        'icon-size': 1.2,
        'icon-rotation-alignment': 'map',
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
      },
      paint: {
        'icon-color': [
          'match',
          ['get', 'status'],
          'operational', '#8b5cf6',
          'warning', '#f59e0b',
          'critical', '#ef4444',
          '#8b5cf6'
        ],
        'icon-opacity': 0.9
      }
    });

    // Add glow effect
    map.addLayer({
      id: `plane-${id}-glow`,
      type: 'circle',
      source: `plane-${id}`,
      paint: {
        'circle-radius': 15,
        'circle-color': '#8b5cf6',
        'circle-opacity': 0.2,
        'circle-blur': 1
      }
    });

    // Add click handler for popup
    map.on('click', `plane-${id}-shape`, () => {
      new mapboxgl.Popup()
        .setLngLat([position[1], position[0]])
        .setHTML(`
          <div class="p-4 bg-white/95 backdrop-blur shadow-lg rounded-lg min-w-[240px]">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-base font-semibold text-gray-900">Plane ${id}</h3>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">Operational</span>
                <div class="h-2 w-2 bg-purple-500 rounded-full"></div>
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Fuel Level</span>
                <span class="font-medium text-gray-900">75%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Altitude</span>
                <span class="font-medium text-gray-900">2500m</span>
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
      if (map.getLayer(`plane-${id}-shape`)) map.removeLayer(`plane-${id}-shape`);
      if (map.getLayer(`plane-${id}-glow`)) map.removeLayer(`plane-${id}-glow`);
      if (map.getSource(`plane-${id}`)) map.removeSource(`plane-${id}`);
    };
  }, [map, id, position, status]);

  return null;
};

export default Plane;