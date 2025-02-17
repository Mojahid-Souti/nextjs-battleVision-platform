// src/hooks/useAssetAnimation.ts
import { useEffect, useRef, useState } from 'react';
import { Coordinate, AssetType } from '@/types/military';

export const useAssetAnimation = (
  path: Coordinate[],
  speed: number,
  type: AssetType
): Coordinate => {
  const [position, setPosition] = useState<Coordinate>(path[0]);
  const pointIndex = useRef(0);
  const progress = useRef(0);

  useEffect(() => {
    if (path.length < 2) return;

    const animate = () => {
      const currentPoint = path[pointIndex.current];
      const nextPoint = path[(pointIndex.current + 1) % path.length];
      
      progress.current += speed;

      if (progress.current >= 1) {
        progress.current = 0;
        pointIndex.current = (pointIndex.current + 1) % path.length;
      }

      // Calculate new position with smooth interpolation
      const newLat = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * progress.current;
      const newLng = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * progress.current;

      setPosition([newLat, newLng]);
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [path, speed, type]);

  return position;
};