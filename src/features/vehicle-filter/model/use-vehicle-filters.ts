import { useState, useCallback } from 'react';
import type { Vehicle } from '@/entities/vehicle';
import { DEFAULT_FILTERS } from './filter.types';
import type { VehicleFilters } from './filter.types';

export function useVehicleFilters(initialFilters?: Partial<VehicleFilters>) {
  const [filters, setFilters] = useState<VehicleFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const updateFilter = useCallback(
    (key: keyof VehicleFilters, value: VehicleFilters[keyof VehicleFilters]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const applyFilters = useCallback(
    (vehicles: Vehicle[]) => {
      return vehicles.filter((vehicle) => {
        // Vehicle Type Filter
        if (
          filters.vehicleTypes.length > 0 &&
          !filters.vehicleTypes.includes(vehicle.vehicle_type)
        ) {
          return false;
        }

        // Range Filter
        if (filters.rangeKm && vehicle.range?.rated) {
          const maxRange = Math.max(...vehicle.range.rated.map((r) => r.range_km));
          if (maxRange < filters.rangeKm.min || maxRange > filters.rangeKm.max) {
            return false;
          }
        }

        // Add logic for price, battery, etc.
        // For brevity in this iteration, I'm keeping it simple but extensible.

        return true;
      });
    },
    [filters]
  );

  return {
    filters,
    updateFilter,
    resetFilters,
    applyFilters,
  };
}
