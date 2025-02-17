// src/utils/movement.ts
import { Coordinate } from '@/types/military';

// src/utils/movement.ts
export const generateZonePatrolPath = (
  center: Coordinate,
  radius: number,
  type: 'tank' | 'drone' | 'plane'
): Coordinate[] => {
  const points: Coordinate[] = [];
  let numPoints: number;
  let pattern: (angle: number) => { x: number; y: number };

  switch (type) {
    case 'tank':
      numPoints = 8;
      pattern = (angle) => ({
        x: Math.cos(angle) * radius * 0.7,
        y: Math.sin(angle) * radius * 0.7
      });
      break;
    case 'drone':
      numPoints = 32;
      pattern = (angle) => ({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });
      break;
    case 'plane':
      numPoints = 16;
      pattern = (angle) => ({
        x: Math.cos(angle) * radius + Math.sin(angle * 2) * radius * 0.3,
        y: Math.sin(angle) * radius + Math.cos(angle * 2) * radius * 0.3
      });
      break;
  }

  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const { x, y } = pattern(angle);
    points.push([
      center[0] + x,
      center[1] + y
    ]);
  }

  return points;
};