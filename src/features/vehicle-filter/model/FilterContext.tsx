import { useState, type ReactNode } from 'react';
import { DEFAULT_FILTERS } from './filter.types';
import type { VehicleFilters } from './filter.types';
import { FilterContext } from './filter-context-definition';

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<VehicleFilters>(DEFAULT_FILTERS);

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>{children}</FilterContext.Provider>
  );
}
