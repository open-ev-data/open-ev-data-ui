import { useCallback } from 'react';
import type { Vehicle } from '@/entities/vehicle';
import { DEFAULT_FILTERS } from './filter.types';
import type { VehicleFilters } from './filter.types';
import { useFilterContext } from './FilterContext';

export function useVehicleFilters() {
  const { filters, setFilters } = useFilterContext();

  const updateFilter = useCallback(
    (key: keyof VehicleFilters, value: VehicleFilters[keyof VehicleFilters]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, [setFilters]);

  const getActiveFilters = useCallback(() => {
    const activeFiltersList: {
      key: keyof VehicleFilters;
      value: VehicleFilters[keyof VehicleFilters];
      label: string;
    }[] = [];

    // Helper to format values
    const formatValue = (key: keyof VehicleFilters, value: any) => {
      if (Array.isArray(value)) return `${value.length} selected`;
      if (typeof value === 'object' && value !== null && 'min' in value)
        return `${value.min} - ${value.max}`;
      return String(value);
    };

    for (const key in filters) {
      const filterKey = key as keyof VehicleFilters;
      const currentValue = filters[filterKey];
      const defaultValue = DEFAULT_FILTERS[filterKey];

      if (!currentValue) continue;

      let isActive = false;
      if (Array.isArray(currentValue)) {
        isActive = currentValue.length > 0;
      } else if (
        typeof currentValue === 'object' &&
        currentValue !== null &&
        'min' in currentValue
      ) {
        const def = defaultValue as any;
        isActive = def && (currentValue.min !== def.min || currentValue.max !== def.max);
      } else {
        isActive = currentValue !== defaultValue;
      }

      if (isActive) {
        activeFiltersList.push({
          key: filterKey,
          value: currentValue,
          label: formatValue(filterKey, currentValue),
        });
      }
    }
    return activeFiltersList;
  }, [filters]);

  const applyFilters = useCallback(
    (vehicles: Vehicle[]) => {
      return vehicles.filter((vehicle) => {
        // Text Search Filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch =
            vehicle.make.name.toLowerCase().includes(searchLower) ||
            vehicle.model.name.toLowerCase().includes(searchLower) ||
            vehicle.trim.name.toLowerCase().includes(searchLower);

          if (!matchesSearch) return false;
        }

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

  const removeFilter = useCallback(
    (key: keyof VehicleFilters) => {
      setFilters((prev) => ({
        ...prev,
        [key]: DEFAULT_FILTERS[key],
      }));
    },
    [setFilters]
  );

  return {
    filters,
    updateFilter,
    resetFilters,
    applyFilters,
    getActiveFilters,
    removeFilter,
  };
}
