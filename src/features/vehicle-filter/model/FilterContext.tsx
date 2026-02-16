import { createContext, useContext, useState, type ReactNode } from 'react';
import { DEFAULT_FILTERS } from './filter.types';
import type { VehicleFilters } from './filter.types';

interface FilterContextType {
  filters: VehicleFilters;
  setFilters: React.Dispatch<React.SetStateAction<VehicleFilters>>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<VehicleFilters>(DEFAULT_FILTERS);

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>{children}</FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
}
