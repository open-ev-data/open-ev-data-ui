import { useState, useEffect, useCallback } from 'react';
import type { Vehicle } from '@/entities/vehicle';

const STORAGE_KEY = 'open-ev-data-compare';
const MAX_COMPARE = 3;

export function useComparison() {
  const [comparedVehicles, setComparedVehicles] = useState<Vehicle[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse compared vehicles', e);
      }
    }
    return [];
  });

  // Save to local storage whenever list changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comparedVehicles));
  }, [comparedVehicles]);

  const addToCompare = useCallback((vehicle: Vehicle) => {
    setComparedVehicles((prev) => {
      if (prev.find((v) => v.unique_code === vehicle.unique_code)) {
        return prev; // Already added
      }
      if (prev.length >= MAX_COMPARE) {
        // Option: Replace oldest or just warn. Here we just return (UI should handle disabled state)
        // Or we could implement FIFO:
        // return [...prev.slice(1), vehicle];
        return prev;
      }
      return [...prev, vehicle];
    });
  }, []);

  const removeFromCompare = useCallback((vehicleId: string) => {
    setComparedVehicles((prev) => prev.filter((v) => v.unique_code !== vehicleId));
  }, []);

  const isInCompare = useCallback(
    (vehicleId: string) => {
      return comparedVehicles.some((v) => v.unique_code === vehicleId);
    },
    [comparedVehicles]
  );

  const clearComparison = useCallback(() => {
    setComparedVehicles([]);
  }, []);

  return {
    comparedVehicles,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearComparison,
    isFull: comparedVehicles.length >= MAX_COMPARE,
  };
}
