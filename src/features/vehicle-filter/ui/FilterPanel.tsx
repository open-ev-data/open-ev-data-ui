import { Search } from 'lucide-react';
import { useVehicleFilters } from '../model/use-vehicle-filters';
import type { VehicleType } from '@/entities/vehicle';
import type { Drivetrain } from '../model/filter.types';
import { Checkbox, Slider, Accordion } from '@/shared/ui';
import { isFieldVisible } from '@/shared/config/field-visibility';
import { cn } from '@/shared/lib/cn';
import styles from './FilterPanel.module.css';

interface FilterOptions {
  years: number[];
  vehicleTypes: VehicleType[];
  drivetrains: Drivetrain[];
  makes: string[];
  availability: string[];
  range: { min: number; max: number };
  battery: { min: number; max: number };
  charging: { min: number; max: number };
  acCharging: { min: number; max: number };
  acceleration: { min: number; max: number };
}

interface FilterPanelProps {
  className?: string;
  filters: ReturnType<typeof useVehicleFilters>['filters'];
  updateFilter: ReturnType<typeof useVehicleFilters>['updateFilter'];
  resetFilters: () => void;
  options?: Partial<FilterOptions>;
}

export function FilterPanel({
  className,
  filters,
  updateFilter,
  resetFilters,
  options = {},
}: FilterPanelProps) {
  const years = options.years || [];
  const vehicleTypes = options.vehicleTypes || [
    'passenger_car',
    'suv',
    'pickup',
    'van',
    'bus',
    'motorcycle',
    'commercial',
    'truck',
  ];
  const drivetrains = options.drivetrains || ['fwd', 'rwd', 'awd', '4wd'];
  const makes = options.makes || [];
  const availabilityStatuses = options.availability || [
    'production',
    'discontinued',
    'concept',
    'announced',
    'prototype',
  ];

  const rangeBounds = options.range || { min: 0, max: 0 };
  const batteryBounds = options.battery || { min: 0, max: 0 };
  const chargingBounds = options.charging || { min: 0, max: 0 };
  const acChargingBounds = options.acCharging || { min: 0, max: 0 };
  const accelerationBounds = options.acceleration || { min: 0, max: 0 };

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

  const sortedYears = [...years].sort((a, b) => b - a);

  return (
    <aside className={cn(styles.panel, className)}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>Filtering</span>
          <button type="button" className={styles.clearButton} onClick={resetFilters}>
            Clear all
          </button>
        </div>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search make, model..."
            className={styles.searchInput}
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
          <Search className={styles.searchIcon} size={16} />
        </div>
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.filterGroup}>
          {isFieldVisible('range') && (
            <Accordion title="Range (WLTP km)" defaultExpanded={true}>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>{Math.max(rangeBounds.min, filters.rangeKm?.min || 0)} km</span>
                  <span>{rangeBounds.max} km</span>
                </div>
                <Slider
                  min={rangeBounds.min}
                  max={rangeBounds.max}
                  step={10}
                  value={Math.max(
                    rangeBounds.min,
                    Math.min(rangeBounds.max, filters.rangeKm?.min || 0)
                  )}
                  onChange={(val) => updateFilter('rangeKm', { ...filters.rangeKm!, min: val })}
                />
              </div>
            </Accordion>
          )}

          {isFieldVisible('battery') && (
            <Accordion title="Battery Capacity (kWh)" defaultExpanded={true}>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>{Math.max(batteryBounds.min, filters.batteryKwh?.min || 0)} kWh</span>
                  <span>{batteryBounds.max} kWh</span>
                </div>
                <Slider
                  min={batteryBounds.min}
                  max={batteryBounds.max}
                  step={5}
                  value={Math.max(
                    batteryBounds.min,
                    Math.min(batteryBounds.max, filters.batteryKwh?.min || 0)
                  )}
                  onChange={(val) =>
                    updateFilter('batteryKwh', { ...filters.batteryKwh!, min: val })
                  }
                />
              </div>
            </Accordion>
          )}

          {isFieldVisible('charging') && (
            <Accordion title="AC Charging Power (kW)" defaultExpanded={true}>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>
                    {Math.max(acChargingBounds.min, filters.acChargingPower?.min || 0)} kW
                  </span>
                  <span>{acChargingBounds.max} kW</span>
                </div>
                <Slider
                  min={acChargingBounds.min}
                  max={acChargingBounds.max}
                  step={1}
                  value={Math.max(
                    acChargingBounds.min,
                    Math.min(acChargingBounds.max, filters.acChargingPower?.min || 0)
                  )}
                  onChange={(val) =>
                    updateFilter('acChargingPower', { ...filters.acChargingPower!, min: val })
                  }
                />
              </div>
            </Accordion>
          )}

          {isFieldVisible('charging') && (
            <Accordion title="DC Charging Power (kW)" defaultExpanded={true}>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>{Math.max(chargingBounds.min, filters.chargingPower?.min || 0)} kW</span>
                  <span>{chargingBounds.max} kW</span>
                </div>
                <Slider
                  min={chargingBounds.min}
                  max={chargingBounds.max}
                  step={10}
                  value={Math.max(
                    chargingBounds.min,
                    Math.min(chargingBounds.max, filters.chargingPower?.min || 0)
                  )}
                  onChange={(val) =>
                    updateFilter('chargingPower', { ...filters.chargingPower!, min: val })
                  }
                />
              </div>
            </Accordion>
          )}

          {isFieldVisible('performance') && (
            <Accordion title="0-100 km/h (s)" defaultExpanded={true}>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>{Math.max(accelerationBounds.min, filters.acceleration?.min || 0)} s</span>
                  <span>{accelerationBounds.max} s</span>
                </div>
                <Slider
                  min={accelerationBounds.min}
                  max={accelerationBounds.max}
                  step={0.5}
                  value={Math.max(
                    accelerationBounds.min,
                    Math.min(accelerationBounds.max, filters.acceleration?.min || 0)
                  )}
                  onChange={(val) =>
                    updateFilter('acceleration', { ...filters.acceleration!, min: val })
                  }
                />
              </div>
            </Accordion>
          )}
        </div>

        <div className={styles.sectionSeparator} />

        <div className={styles.filterGroup}>
          <Accordion title="Brands" defaultExpanded={false}>
            <div className={styles.checkboxGroup}>
              {makes.map((make) => (
                <Checkbox
                  key={make}
                  id={`make-${make}`}
                  label={make}
                  checked={filters.makes.includes(make)}
                  onCheckedChange={(checked) => {
                    const current = filters.makes;
                    updateFilter(
                      'makes',
                      checked ? [...current, make] : current.filter((m) => m !== make)
                    );
                  }}
                />
              ))}
              {makes.length === 0 && <div className={styles.emptyState}>No brands available</div>}
            </div>
          </Accordion>
          <Accordion title="Year" defaultExpanded={false}>
            <div className={styles.checkboxGroup}>
              {sortedYears.map((year) => (
                <Checkbox
                  key={year}
                  id={`year-${year}`}
                  label={year.toString()}
                  checked={filters.years.includes(year)}
                  onCheckedChange={(checked) => {
                    const current = filters.years;
                    updateFilter(
                      'years',
                      checked ? [...current, year] : current.filter((y) => y !== year)
                    );
                  }}
                />
              ))}
              {sortedYears.length === 0 && (
                <div className={styles.emptyState}>No years available</div>
              )}
            </div>
          </Accordion>
          <Accordion title="Market Availability">
            <div className={styles.checkboxGroup}>
              {availabilityStatuses.map((status) => (
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
              {vehicleTypes.map((type) => (
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

          <Accordion title="Drivetrain">
            <div className={styles.checkboxGroup}>
              {drivetrains.map((dt) => (
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
        </div>
      </div>
    </aside>
  );
}
