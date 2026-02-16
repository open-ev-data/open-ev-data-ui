import type { Vehicle } from '../model/vehicle.types';
import { getVehicleRange } from '../model/vehicle.helpers';
import { DataField } from '@/shared/lib/data-presence';
import { cn } from '@/shared/lib/cn';
import styles from './VehicleSpecsTable.module.css';
import { isFieldVisible } from '@/shared/config/field-visibility';

interface VehicleSpecsTableProps {
  vehicle: Vehicle;
  variant?: 'default' | 'compact';
  className?: string;
}

export function VehicleSpecsTable({
  vehicle,
  variant = 'default',
  className,
}: VehicleSpecsTableProps) {
  return (
    <div className={cn(styles.container, variant === 'compact' && styles.compact, className)}>
      {/* Price - Only show if visible config allows and data exists */}
      {isFieldVisible('pricing') && (
        <DataField
          value={vehicle.pricing?.msrp?.[0]}
          render={(msrp) => (
            <div className={styles.item}>
              <span className={styles.value}>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: msrp.currency,
                  maximumSignificantDigits: 3,
                }).format(msrp.amount)}
              </span>
              <span className={styles.label}>Price</span>
            </div>
          )}
        />
      )}

      {/* Range (WLTP/EPA) - Always shown if data exists */}
      <DataField
        value={vehicle.range?.rated}
        render={() => (
          <div className={styles.item}>
            <span className={styles.value}>{getVehicleRange(vehicle).split(' ')[0]}</span>
            <span className={styles.label}>Km Range</span>
          </div>
        )}
      />

      {/* Battery Capacity */}
      <DataField
        value={vehicle.battery?.pack_capacity_kwh_net || vehicle.battery?.pack_capacity_kwh_gross}
        render={(kwh) => (
          <div className={styles.item}>
            <span className={styles.value}>{Math.round(kwh)}</span>
            <span className={styles.label}>kWh Battery</span>
          </div>
        )}
      />

      {/* 0-100 km/h acceleration */}
      <DataField
        value={vehicle.performance?.acceleration_0_100_kmh_s}
        render={(accel) => (
          <div className={styles.item}>
            <span className={styles.value}>{accel}s</span>
            <span className={styles.label}>0-100 km/h</span>
          </div>
        )}
      />
    </div>
  );
}
