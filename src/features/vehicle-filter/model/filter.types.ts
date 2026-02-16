import type { VehicleType } from '@/entities/vehicle';

export type Drivetrain = 'fwd' | 'rwd' | 'awd' | '4wd';

export interface RangeFilter {
  min: number;
  max: number;
}

export interface VehicleFilters {
  search?: string;
  priceRange?: RangeFilter;
  rangeKm?: RangeFilter;
  batteryKwh?: RangeFilter;
  acceleration?: RangeFilter;
  chargingPower?: RangeFilter;
  vehicleTypes: VehicleType[];
  drivetrains: Drivetrain[];
  availabilityStatus: string[];
}

export const DEFAULT_FILTERS: VehicleFilters = {
  search: '',
  vehicleTypes: [],
  drivetrains: [],
  availabilityStatus: [],
  rangeKm: { min: 0, max: 1000 },
  batteryKwh: { min: 0, max: 200 },
  acceleration: { min: 0, max: 15 },
  chargingPower: { min: 0, max: 400 },
};
