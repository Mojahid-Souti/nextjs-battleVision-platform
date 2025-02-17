// src/components/Assets/military/Asset.tsx
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Coordinate } from '@/types/military';

interface AssetProps {
  id: string;
  type: 'tank' | 'drone' | 'plane';
  position: Coordinate;
  map: mapboxgl.Map;
  status?: 'operational' | 'warning' | 'critical';
}

const ASSET_COLORS = {
  tank: '#22c55e',   // green
  drone: '#3b82f6',  // blue
  plane: '#8b5cf6'   // purple
};

const STATUS_COLORS = {
  operational: 'green',
  warning: '#f59e0b',
  critical: '#ef4444'
};

export const Asset: React.FC<AssetProps> = ({
  id,
  type,
  position,
  map,
  status = 'operational'
}) => {
  useEffect(() => {
    if (!map) return;

    // Add source for the asset
    map.addSource(`asset-${id}`, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [position[1], position[0]]
        },
        properties: {
          type,
          status
        }
      }
    });

    // Add glow effect layer
    map.addLayer({
      id: `asset-${id}-glow`,
      type: 'circle',
      source: `asset-${id}`,
      paint: {
        'circle-radius': 15,
        'circle-color': ASSET_COLORS[type],
        'circle-opacity': 0.2,
        'circle-blur': 1
      }
    });

    // Add main shape layer
    map.addLayer({
      id: `asset-${id}-shape`,
      type: 'circle',
      source: `asset-${id}`,
      paint: {
        'circle-radius': 8,
        'circle-color': ASSET_COLORS[type],
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': 'white'
      }
    });

    // Add hover effects
    map.on('mouseenter', `asset-${id}-shape`, () => {
      map.getCanvas().style.cursor = 'pointer';
      map.setPaintProperty(`asset-${id}-glow`, 'circle-radius', 20);
      map.setPaintProperty(`asset-${id}-shape`, 'circle-radius', 10);
    });

    map.on('mouseleave', `asset-${id}-shape`, () => {
      map.getCanvas().style.cursor = '';
      map.setPaintProperty(`asset-${id}-glow`, 'circle-radius', 15);
      map.setPaintProperty(`asset-${id}-shape`, 'circle-radius', 8);
    });

    // Add popup
    map.on('click', `asset-${id}-shape`, (e) => {
      const coordinates = e.lngLat;

      new mapboxgl.Popup({
        closeButton: false,
        className: 'asset-popup'
      })
        .setLngLat(coordinates)
        .setHTML(`
          <div class="p-4 bg-white/95 backdrop-blur-sm rounded-lg min-w-[240px]">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-base font-semibold text-gray-900">${type.toUpperCase()} - ${id}</h3>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">${status}</span>
                <div class="h-2 w-2 rounded-full" style="background-color: ${STATUS_COLORS[status]}"></div>
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Status</span>
                <span class="font-medium text-gray-900">${status}</span>
              </div>
              ${type === 'tank' ? `
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Ammunition</span>
                  <span class="font-medium text-gray-900">87%</span>
                </div>
              ` : type === 'drone' ? `
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Battery</span>
                  <span class="font-medium text-gray-900">82%</span>
                </div>
              ` : `
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Fuel</span>
                  <span class="font-medium text-gray-900">75%</span>
                </div>
              `}
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
      if (map.getLayer(`asset-${id}-shape`)) {
        map.removeLayer(`asset-${id}-shape`);
      }
      if (map.getLayer(`asset-${id}-glow`)) {
        map.removeLayer(`asset-${id}-glow`);
      }
      if (map.getSource(`asset-${id}`)) {
        map.removeSource(`asset-${id}`);
      }
    };
  }, [map, id, type, position, status]);

  return null;
};

export default Asset;