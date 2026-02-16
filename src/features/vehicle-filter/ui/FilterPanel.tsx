import { useVehicleFilters } from '../model/use-vehicle-filters';
import type { VehicleType } from '@/entities/vehicle';
import type { Drivetrain } from '../model/filter.types';
import { Checkbox, Slider, Accordion } from '@/shared/ui';
import { isFieldVisible } from '@/shared/config/field-visibility';
import { cn } from '@/shared/lib/cn';
import styles from './FilterPanel.module.css';

interface FilterPanelProps {
  className?: string;
  filters: ReturnType<typeof useVehicleFilters>['filters'];
  updateFilter: ReturnType<typeof useVehicleFilters>['updateFilter'];
}

export function FilterPanel({ className, filters, updateFilter }: FilterPanelProps) {
  const VEHICLE_TYPES: VehicleType[] = [
    'passenger_car',
    'suv',
    'pickup',
    'van',
    'bus',
    'motorcycle',
    'commercial',
    'truck',
  ];

  const DRIVETRAINS: Drivetrain[] = ['fwd', 'rwd', 'awd', '4wd'];

  const AVAILABILITY_STATUSES = ['production', 'discontinued', 'concept', 'announced', 'prototype'];

  const handleTypeChange = (type: VehicleType, checked: boolean) => {
    const current = filters.vehicleTypes;
    updateFilter('vehicleTypes', checked ? [...current, type] : current.filter((t) => t !== type));
  };

  const handleDrivetrainChange = (drivetrain: Drivetrain, checked: boolean) => {
    const current = filters.drivetrains;
    updateFilter(
      'drivetrains',
      checked ? [...current, drivetrain] : current.filter((d) => d !== drivetrain)
    );
  };

  const handleAvailabilityChange = (status: string, checked: boolean) => {
    const current = filters.availabilityStatus;
    updateFilter(
      'availabilityStatus',
      checked ? [...current, status] : current.filter((s) => s !== status)
    );
  };

  return (
    <aside className={cn(styles.panel, className)}>
      <div className={styles.title}>
        <span>Filtering</span>
      </div>

      <Accordion title="Market Availability">
        <div className={styles.checkboxGroup}>
          {AVAILABILITY_STATUSES.map((status) => (
            <Checkbox
              key={status}
              id={`status-${status}`}
              label={status.charAt(0).toUpperCase() + status.slice(1)}
              checked={filters.availabilityStatus.includes(status)}
              onCheckedChange={(checked) => handleAvailabilityChange(status, checked)}
            />
          ))}
        </div>
      </Accordion>

      <Accordion title="Vehicle Type">
        <div className={styles.checkboxGroup}>
          {VEHICLE_TYPES.map((type) => (
            <Checkbox
              key={type}
              id={`type-${type}`}
              label={type.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              checked={filters.vehicleTypes.includes(type)}
              onCheckedChange={(checked) => handleTypeChange(type, checked)}
            />
          ))}
        </div>
      </Accordion>

      {isFieldVisible('range') && (
        <Accordion title="Range (WLTP km)">
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span>{filters.rangeKm?.min} km</span>
              <span>{filters.rangeKm?.max} km</span>
            </div>
            <Slider
              min={0}
              max={1000}
              step={10}
              value={filters.rangeKm?.min || 0}
              onChange={(val) => updateFilter('rangeKm', { ...filters.rangeKm!, min: val })}
            />
          </div>
        </Accordion>
      )}

      {isFieldVisible('battery') && (
        <Accordion title="Battery Capacity (kWh)">
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span>{filters.batteryKwh?.min} kWh</span>
              <span>{filters.batteryKwh?.max} kWh</span>
            </div>
            <Slider
              min={0}
              max={200}
              step={5}
              value={filters.batteryKwh?.min || 0}
              onChange={(val) => updateFilter('batteryKwh', { ...filters.batteryKwh!, min: val })}
            />
          </div>
        </Accordion>
      )}

      {isFieldVisible('charging') && (
        <Accordion title="DC Charging Power (kW)">
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span>{filters.chargingPower?.min} kW</span>
              <span>{filters.chargingPower?.max} kW</span>
            </div>
            <Slider
              min={0}
              max={400}
              step={10}
              value={filters.chargingPower?.min || 0}
              onChange={(val) =>
                updateFilter('chargingPower', { ...filters.chargingPower!, min: val })
              }
            />
          </div>
        </Accordion>
      )}

      {isFieldVisible('performance') && (
        <Accordion title="0-100 km/h (s)">
          <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <span>{filters.acceleration?.min} s</span>
              <span>{filters.acceleration?.max} s</span>
            </div>
            <Slider
              min={0}
              max={15}
              step={0.5}
              value={filters.acceleration?.min || 0}
              onChange={(val) =>
                updateFilter('acceleration', { ...filters.acceleration!, min: val })
              }
            />
          </div>
        </Accordion>
      )}

      <Accordion title="Drivetrain">
        <div className={styles.checkboxGroup}>
          {DRIVETRAINS.map((dt) => (
            <Checkbox
              key={dt}
              id={`dt-${dt}`}
              label={dt.toUpperCase()}
              checked={filters.drivetrains.includes(dt)}
              onCheckedChange={(checked) => handleDrivetrainChange(dt, checked)}
            />
          ))}
        </div>
      </Accordion>
    </aside>
  );
}
