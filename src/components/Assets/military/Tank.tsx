// src/components/Assets/military/Tank.tsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Coordinate } from '@/types/military';

interface TankProps {
  id: string;
  position: Coordinate;
  map: mapboxgl.Map;
}

const Tank: React.FC<TankProps> = ({ id, position, map }) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    // Important: MapboxGL uses [lng, lat], so we need to reverse our coordinates
    const [lat, lng] = position;
    
    const el = document.createElement('div');
    el.className = 'military-marker tank-marker';
  
    const iconContainer = document.createElement('div');
    iconContainer.className = 'relative flex items-center justify-center w-8 h-8';
    
    // Create SVG icon
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '32');
    svg.setAttribute('height', '32');
    svg.setAttribute('viewBox', '0 0 32 32');
    
    // Create circle background
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '16');
    circle.setAttribute('cy', '16');
    circle.setAttribute('r', '14');
    circle.setAttribute('fill', '#22c55e');
    circle.setAttribute('stroke', 'white');
    circle.setAttribute('stroke-width', '2');
    
    // Add 'T' text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '16');
    text.setAttribute('y', '20');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '14px');
    text.textContent = 'T';
    
    svg.appendChild(circle);
    svg.appendChild(text);
    iconContainer.appendChild(svg);
    el.appendChild(iconContainer);

    // Add status indicator
    const status = document.createElement('div');
    status.className = 'absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 ring-2 ring-white';
    el.appendChild(status);

    // Create marker
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'center'
    })
    .setLngLat([lng, lat])
    .addTo(map);

    // Add popup
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      className: 'asset-popup'
    }).setHTML(`
      <div class="p-3">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-medium">Tank ${id}</h3>
          <span class="px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded-full">Active</span>
        </div>
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Status</span>
            <span class="font-medium">Operational</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Fuel</span>
            <span class="font-medium">92%</span>
          </div>
        </div>
      </div>
    `);

    marker.setPopup(popup);
    markerRef.current = marker;

    return () => {
      marker.remove();
    };
  }, [id, position, map]);

  return null;
};

export default Tank;