import { useVehicleFilters } from '../model/use-vehicle-filters';
import type { VehicleType } from '@/entities/vehicle';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox';
import { Slider } from '@/shared/ui/Slider/Slider';
import { isFieldVisible } from '@/shared/config/field-visibility';
import { cn } from '@/shared/lib/cn';
import styles from './FilterPanel.module.css';

interface FilterPanelProps {
  className?: string;
  filters: ReturnType<typeof useVehicleFilters>['filters'];
  updateFilter: ReturnType<typeof useVehicleFilters>['updateFilter'];
}

export function FilterPanel({ className, filters, updateFilter }: FilterPanelProps) {
  const VEHICLE_TYPES: VehicleType[] = ['passenger_car', 'suv', 'pickup', 'van', 'motorcycle'];

  const handleTypeChange = (type: VehicleType, checked: boolean) => {
    const current = filters.vehicleTypes;
    if (checked) {
      updateFilter('vehicleTypes', [...current, type]);
    } else {
      updateFilter(
        'vehicleTypes',
        current.filter((t: VehicleType) => t !== type)
      );
    }
  };

  return (
    <aside className={cn(styles.panel, className)}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Vehicle Type</h3>
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
      </div>

      {isFieldVisible('range') && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Range (km)</h3>
          <Slider
            min={0}
            max={1000}
            step={50}
            value={filters.rangeKm?.min || 0}
            onChange={(val) => updateFilter('rangeKm', { min: val, max: 1000 })}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
            }}
          >
            <span>{filters.rangeKm?.min || 0} km</span>
            <span>{filters.rangeKm?.max || 1000} km</span>
          </div>
        </div>
      )}

      {/* Add more filters here based on isFieldVisible */}
    </aside>
  );
}
