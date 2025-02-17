// src/components/Assets/military/AssetMarker.tsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Coordinate } from '@/types/military';

interface AssetMarkerProps {
  type: string;
  position: Coordinate;
  id: string;
  onMarkerCreated?: (marker: mapboxgl.Marker) => void;
}

export const AssetMarker: React.FC<AssetMarkerProps> = ({
  type,
  position,
  id,
  onMarkerCreated
}) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    // Create marker container
    const el = document.createElement('div');
    el.className = `military-marker military-marker-${type}`;
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.zIndex = '9999';

    // Create marker container
    const container = document.createElement('div');
    container.className = 'marker-container';

    // Create icon
    const img = document.createElement('img');
    img.src = `/src/assets/icons/${type}.svg`;  // Make sure you have these icons
    img.alt = type;

    // Create glow effect
    const glow = document.createElement('div');
    glow.className = 'glow';

    // Create status indicator
    const status = document.createElement('div');
    status.className = 'status';

    // Assemble marker
    container.appendChild(glow);
    container.appendChild(img);
    el.appendChild(container);
    el.appendChild(status);

    // Create and add marker - IMPORTANT: Swap coordinates for Mapbox
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'center',
      offset: [0, 0]
    })
    .setLngLat([position[1], position[0]]); // Swap lat/lng for Mapbox

    // Add popup
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      className: 'asset-popup'
    })
    .setHTML(`
      <div class="p-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold">${type.toUpperCase()} - ${id}</h3>
          <span class="px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded-full">Active</span>
        </div>
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Status</span>
            <span class="font-medium">Operational</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Location</span>
            <span class="font-medium">${position[1].toFixed(4)}, ${position[0].toFixed(4)}</span>
          </div>
        </div>
      </div>
    `);

    marker.setPopup(popup);

    if (onMarkerCreated) {
      onMarkerCreated(marker);
      console.log(`Created marker at [${position[1]}, ${position[0]}]`);
    }

    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [type, position, id, onMarkerCreated]);

  return null;
};