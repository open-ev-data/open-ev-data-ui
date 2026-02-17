import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Vehicle } from '@/entities/vehicle';
import { ComparisonContext } from './comparison-context-definition';

const STORAGE_KEY = 'open-ev-data-compare';
const MAX_COMPARE = 3;

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparedVehicles, setComparedVehicles] = useState<Vehicle[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse compared vehicles', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comparedVehicles));
  }, [comparedVehicles]);

  const addToCompare = useCallback((vehicle: Vehicle) => {
    setComparedVehicles((prev) => {
      if (prev.find((v) => v.unique_code === vehicle.unique_code)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, vehicle];
    });
  }, []);

  const removeFromCompare = useCallback((vehicleId: string) => {
    setComparedVehicles((prev) => prev.filter((v) => v.unique_code !== vehicleId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparedVehicles([]);
  }, []);

  const isInCompare = useCallback(
    (vehicleId: string) => comparedVehicles.some((v) => v.unique_code === vehicleId),
    [comparedVehicles]
  );

  const value = {
    comparedVehicles,
    setComparedVehicles,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearComparison,
    isFull: comparedVehicles.length >= MAX_COMPARE,
  };

  return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>;
}
