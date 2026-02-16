import type { VehicleType } from '@/entities/vehicle';

export interface RangeFilter {
  min: number;
  max: number;
}

export interface VehicleFilters {
  priceRange?: RangeFilter;
  rangeKm?: RangeFilter;
  batteryKwh?: RangeFilter;
  acceleration?: RangeFilter;
  vehicleTypes: VehicleType[];
  // Add more filters as needed
}

export const DEFAULT_FILTERS: VehicleFilters = {
  vehicleTypes: [],
  priceRange: { min: 0, max: 200000 }, // Example defaults
  rangeKm: { min: 0, max: 1000 },
};
