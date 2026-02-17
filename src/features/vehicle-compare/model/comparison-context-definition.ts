import { createContext } from 'react';
import type { Vehicle } from '@/entities/vehicle';

export interface ComparisonContextValue {
  comparedVehicles: Vehicle[];
  setComparedVehicles: (vehicles: Vehicle[]) => void;
  addToCompare: (vehicle: Vehicle) => void;
  removeFromCompare: (vehicleId: string) => void;
  isInCompare: (vehicleId: string) => boolean;
  clearComparison: () => void;
  isFull: boolean;
}

export const ComparisonContext = createContext<ComparisonContextValue | undefined>(undefined);
