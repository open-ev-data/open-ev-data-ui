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

        // Drivetrain Filter
        if (
          filters.drivetrains.length > 0 &&
          !filters.drivetrains.includes(vehicle.powertrain.drivetrain)
        ) {
          return false;
        }

        // Battery Capacity Filter
        if (filters.batteryKwh && vehicle.battery?.pack_capacity_kwh_net) {
          const battery = vehicle.battery.pack_capacity_kwh_net;
          if (battery < filters.batteryKwh.min || battery > filters.batteryKwh.max) {
            return false;
          }
        }

        // Charging Power Filter (DC)
        if (filters.chargingPower && vehicle.charging?.dc?.max_power_kw) {
          const power = vehicle.charging.dc.max_power_kw;
          if (power < filters.chargingPower.min || power > filters.chargingPower.max) {
            return false;
          }
        }

        // Acceleration Filter (0-100 km/h)
        if (filters.acceleration && vehicle.performance?.acceleration_0_100_kmh_s) {
          const accel = vehicle.performance.acceleration_0_100_kmh_s;
          if (accel < filters.acceleration.min || accel > filters.acceleration.max) {
            return false;
          }
        }

        // Availability Filter
        if (
          filters.availabilityStatus.length > 0 &&
          (!vehicle.availability?.status ||
            !filters.availabilityStatus.includes(vehicle.availability.status))
        ) {
          return false;
        }

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
