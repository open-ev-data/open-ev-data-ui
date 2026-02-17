import { createContext } from 'react';
import type { VehicleFilters } from './filter.types';

export interface FilterContextType {
  filters: VehicleFilters;
  setFilters: React.Dispatch<React.SetStateAction<VehicleFilters>>;
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined);
