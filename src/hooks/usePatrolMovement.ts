// src/hooks/usePatrolMovement.ts
import { useEffect, useRef, useState } from 'react';
import { Coordinate } from '@/types/military';

interface PatrolMovementOptions {
  speed: number;
  pauseDuration: number;
  rotationSpeed?: number;
}

interface PatrolMovementResult {
  position: Coordinate;
  rotation: number;
  isFiring: boolean;
  isMoving: boolean;  // Added this
}

export const usePatrolMovement = (
  patrolPoints: Coordinate[],
  options: PatrolMovementOptions
): PatrolMovementResult => {
  const [position, setPosition] = useState<Coordinate>(patrolPoints[0]);
  const [rotation, setRotation] = useState(0);
  const [isFiring, setIsFiring] = useState(false);
  const [isMoving, setIsMoving] = useState(false);  // Added this

  const pointIndexRef = useRef(0);
  const progressRef = useRef(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    let animationFrame: number;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isPausedRef.current) {
        setIsMoving(true);  // Moving
        progressRef.current += options.speed * deltaTime;

        if (progressRef.current >= 1) {
          progressRef.current = 0;
          isPausedRef.current = true;
          setIsMoving(false);  // Stopped
          
          if (Math.random() < 0.3) {
            setIsFiring(true);
            setTimeout(() => setIsFiring(false), 200);
          }

          setTimeout(() => {
            isPausedRef.current = false;
            pointIndexRef.current = (pointIndexRef.current + 1) % patrolPoints.length;
          }, options.pauseDuration);
        }

        const currentPoint = patrolPoints[pointIndexRef.current];
        const nextPoint = patrolPoints[(pointIndexRef.current + 1) % patrolPoints.length];

        // Calculate new position
        const newLat = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * progressRef.current;
        const newLng = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * progressRef.current;

        // Calculate rotation angle
        const angle = Math.atan2(
          nextPoint[1] - currentPoint[1],
          nextPoint[0] - currentPoint[0]
        ) * (180 / Math.PI);

        setPosition([newLat, newLng]);
        setRotation(angle);
      } else {
        setIsMoving(false);  // Paused
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [patrolPoints, options.speed, options.pauseDuration]);

  return { position, rotation, isFiring, isMoving };
};