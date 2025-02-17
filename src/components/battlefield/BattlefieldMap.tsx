// src/components/battlefield/BattlefieldMap.tsx
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Activity, Shield, Radar, Laptop } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { OMAN_SURVEILLANCE_ZONES } from '@/config/zones';
import { ZoneAssets } from '../Assets/military/ZoneAssets';

// Initialize Mapbox
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

// Types
interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  color?: string;
  suffix?: string;
}

// Component for metric cards
const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  trend = 'up',
  color = 'blue',
  suffix
}) => (
  <Card className="relative overflow-hidden transition-all hover:shadow-md">
    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50" />
    <div className="relative p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline gap-1 mt-2">
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            {suffix && (
              <span className="text-sm font-medium text-gray-500">{suffix}</span>
            )}
          </div>
          {change && (
            <p className={`flex items-center gap-1 mt-2 text-sm font-medium
              ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
            >
              {trend === 'up' ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl bg-${color}-50 ring-1 ring-${color}-100/20`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
      </div>
    </div>
  </Card>
);

const BattlefieldMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN || mapInstance.current) return;

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [58.4159, 23.5957],
      zoom: 12,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    });

    mapInstance.current = newMap;

    // Add basic map controls
    newMap.addControl(new mapboxgl.NavigationControl(), 'top-left');
    
    // Style overrides for markers
    const style = document.createElement('style');
    style.textContent = `
      .mapboxgl-marker {
        z-index: 9999 !important;
        pointer-events: auto !important;
      }

      .military-marker {
        width: 40px !important;
        height: 40px !important;
        position: relative !important;
        z-index: 1000 !important;
        pointer-events: auto !important;
      }

      .marker-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform-origin: center;
        transition: transform 0.2s ease;
      }

      .marker-container:hover {
        transform: scale(1.2);
      }

      .marker-container img {
        width: 24px;
        height: 24px;
        object-fit: contain;
        z-index: 2;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }
    `;
    document.head.appendChild(style);

    // Handle map load
    newMap.on('load', () => {
      console.log('Map loaded');
      setMap(newMap);

      // Add terrain
      newMap.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      newMap.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      // Add zones
      Object.values(OMAN_SURVEILLANCE_ZONES).forEach(zone => {
        // Add zone source
        newMap.addSource(`zone-${zone.id}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [zone.coordinates]
            }
          }
        });

        // Add zone layers
        newMap.addLayer({
          id: `zone-fill-${zone.id}`,
          type: 'fill',
          source: `zone-${zone.id}`,
          paint: {
            'fill-color': zone.style.fillColor,
            'fill-opacity': zone.style.fillOpacity,
          }
        });

        newMap.addLayer({
          id: `zone-border-${zone.id}`,
          type: 'line',
          source: `zone-${zone.id}`,
          paint: {
            'line-color': zone.style.borderColor,
            'line-width': zone.style.borderWidth,
            'line-dasharray': [2, 2],
            'line-opacity': 0.8
          }
        });

        // Add hover effects
        newMap.on('mousemove', `zone-fill-${zone.id}`, () => {
          newMap.setPaintProperty(
            `zone-fill-${zone.id}`,
            'fill-color',
            zone.style.hoverColor
          );
          newMap.setPaintProperty(
            `zone-fill-${zone.id}`,
            'fill-opacity',
            zone.style.hoverOpacity
          );
        });

        newMap.on('mouseleave', `zone-fill-${zone.id}`, () => {
          newMap.setPaintProperty(
            `zone-fill-${zone.id}`,
            'fill-color',
            zone.style.fillColor
          );
          newMap.setPaintProperty(
            `zone-fill-${zone.id}`,
            'fill-opacity',
            zone.style.fillOpacity
          );
        });
      });
    });

    return () => {
      document.head.removeChild(style);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="rounded-lg h-min-screen">
      {/* Header with Metrics */}
      <div className="h-auto bg-gradient-to-b from-white to-gray-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Battlefield Map</h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <span className="text-sm font-medium text-gray-600">Live Status</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
  
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-5">
            <MetricCard
              title="Active Assets"
              value="34"
              change="8% from last hour"
              icon={Activity}
              trend="up"
            />
            <MetricCard
              title="Coverage Area"
              value="12.5"
              suffix="km²"
              icon={Shield}
              color="indigo"
            />
            <MetricCard
              title="Network Status"
              value="98%"
              change="2% from last hour"
              icon={Radar}
              color="green"
            />
            <MetricCard
              title="System Alerts"
              value="3"
              change="5 resolved"
              icon={Laptop}
              color="amber"
              trend="down"
            />
          </div>
        </div>
      </div>
  
      {/* Map Container */}
      <div className="relative flex-1 h-[calc(100vh-200px)]">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
        {map && Object.values(OMAN_SURVEILLANCE_ZONES).map((zone) => (
          <ZoneAssets 
            key={zone.id} 
            zone={zone} 
            map={map} 
          />
        ))}
      </div>
    </div>
  );
};

export default BattlefieldMap;