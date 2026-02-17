import type { VehicleType } from '@/entities/vehicle';

export type Drivetrain = 'fwd' | 'rwd' | 'awd' | '4wd';

export interface RangeFilter {
  min: number;
  max: number;
}

export interface FilterOptions {
  years: number[];
  vehicleTypes: VehicleType[];
  drivetrains: Drivetrain[];
  availability: string[];
  range: { min: number; max: number };
  battery: { min: number; max: number };
  charging: { min: number; max: number };
  acceleration: { min: number; max: number };
}

export interface VehicleFilters {
  search?: string;
  priceRange?: RangeFilter;
  years: number[];
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
  years: [],
  rangeKm: { min: 0, max: Number.MAX_SAFE_INTEGER },
  batteryKwh: { min: 0, max: Number.MAX_SAFE_INTEGER },
  acceleration: { min: 0, max: Number.MAX_SAFE_INTEGER },
  chargingPower: { min: 0, max: Number.MAX_SAFE_INTEGER },
};
