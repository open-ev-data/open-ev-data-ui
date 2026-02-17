import { useCallback } from 'react';
import type { Vehicle } from '@/entities/vehicle';
import { DEFAULT_FILTERS } from './filter.types';
import type { VehicleFilters, FilterOptions, RangeFilter } from './filter.types';
import { useFilterContext } from './use-filter-context';

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
    const formatValue = (value: VehicleFilters[keyof VehicleFilters]) => {
      if (Array.isArray(value)) return `${value.length} selected`;
      if (typeof value === 'object' && value !== null && 'min' in value) {
        const rangeValue = value as RangeFilter;
        if (rangeValue.max >= Number.MAX_SAFE_INTEGER) {
          return `> ${rangeValue.min}`;
        }
        return `${rangeValue.min} - ${rangeValue.max}`;
      }
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
        const def = defaultValue as RangeFilter | undefined;
        isActive = !!def && (currentValue.min !== def.min || currentValue.max !== def.max);
      } else {
        isActive = currentValue !== defaultValue;
      }

      if (isActive) {
        activeFiltersList.push({
          key: filterKey,
          value: currentValue,
          label: formatValue(currentValue),
        });
      }
    }
    return activeFiltersList;
  }, [filters]);

  const applyFilters = useCallback(
    (vehicles: Vehicle[], options?: FilterOptions) => {
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
        const rangeMinBound = options?.range.min ?? 0;
        const currentRangeMin = filters.rangeKm?.min ?? 0;

        if (currentRangeMin > rangeMinBound) {
          if (!vehicle.range?.rated) return false;
          const maxRange = Math.max(...vehicle.range.rated.map((r) => r.range_km));
          if (
            maxRange < currentRangeMin ||
            (filters.rangeKm?.max && maxRange > filters.rangeKm.max)
          ) {
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

        // Make Filter
        if (filters.makes.length > 0 && !filters.makes.includes(vehicle.make.name)) {
          return false;
        }

        // Battery Capacity Filter
        const batteryMinBound = options?.battery.min ?? 0;
        const currentBatteryMin = filters.batteryKwh?.min ?? 0;

        if (currentBatteryMin > batteryMinBound) {
          if (!vehicle.battery?.pack_capacity_kwh_net) return false;
          const battery = vehicle.battery.pack_capacity_kwh_net;
          if (
            battery < currentBatteryMin ||
            (filters.batteryKwh?.max && battery > filters.batteryKwh.max)
          ) {
            return false;
          }
        }

        // Charging Power Filter (DC)
        const chargingMinBound = options?.charging.min ?? 0;
        const currentChargingMin = filters.chargingPower?.min ?? 0;

        if (currentChargingMin > chargingMinBound) {
          if (!vehicle.charging?.dc?.max_power_kw) return false;
          const power = vehicle.charging.dc.max_power_kw;
          if (
            power < currentChargingMin ||
            (filters.chargingPower?.max && power > filters.chargingPower.max)
          ) {
            return false;
          }
        }

        // AC Charging Power Filter
        const acChargingMinBound = options?.acCharging.min ?? 0;
        const currentAcChargingMin = filters.acChargingPower?.min ?? 0;

        if (currentAcChargingMin > acChargingMinBound) {
          if (!vehicle.charging?.ac?.max_power_kw) return false;
          const power = vehicle.charging.ac.max_power_kw;
          if (
            power < currentAcChargingMin ||
            (filters.acChargingPower?.max && power > filters.acChargingPower.max)
          ) {
            return false;
          }
        }

        // Acceleration Filter (0-100 km/h)
        const accelMinBound = options?.acceleration.min ?? 0;
        const currentAccelMin = filters.acceleration?.min ?? 0;

        if (currentAccelMin > accelMinBound) {
          if (!vehicle.performance?.acceleration_0_100_kmh_s) return false;
          const accel = vehicle.performance.acceleration_0_100_kmh_s;
          if (
            accel < currentAccelMin ||
            (filters.acceleration?.max && accel > filters.acceleration.max)
          ) {
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

        // Year Filter
        if (filters.years.length > 0 && vehicle.year && !filters.years.includes(vehicle.year)) {
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
