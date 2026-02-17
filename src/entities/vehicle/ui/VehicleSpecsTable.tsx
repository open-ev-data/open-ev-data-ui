import type { Vehicle } from '../model/vehicle.types';
import { getVehicleRange } from '../model/vehicle.helpers';
import { DataField } from '@/shared/lib/data-presence';
import { cn } from '@/shared/lib/cn';
import styles from './VehicleSpecsTable.module.css';
import { isFieldVisible } from '@/shared/config/field-visibility';

interface VehicleSpecsTableProps {
  vehicle: Vehicle;
  variant?: 'default' | 'compact' | 'visual';
  className?: string;
}

export function VehicleSpecsTable({
  vehicle,
  variant = 'default',
  className,
}: VehicleSpecsTableProps) {
  const isCompact = variant === 'compact';
  const isVisual = variant === 'visual';
  const containerClass = isCompact ? styles.compact : isVisual ? styles.visual : '';

  return (
    <div className={cn(styles.container, containerClass, className)}>
      {/* Price - Hide in compact/visual view */}
      {!isCompact && !isVisual && isFieldVisible('pricing') && (
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

      {/* Range (WLTP/EPA) */}
      <DataField
        value={vehicle.range?.rated}
        render={() => {
          const rangeKm = getVehicleRange(vehicle).split(' ')[0];
          const rangeValue = parseFloat(rangeKm) || 0;
          const percentage = Math.min((rangeValue / 800) * 100, 100);

          return (
            <div className={styles.item}>
              <div className={styles.valueGroup}>
                <span className={styles.value}>{rangeKm}</span>
              </div>
              <span className={styles.label}>{isCompact ? 'WLTP km' : 'WLTP KM'}</span>
              {isVisual && (
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
                </div>
              )}
            </div>
          );
        }}
      />

      {/* Battery Capacity */}
      <DataField
        value={vehicle.battery?.pack_capacity_kwh_net || vehicle.battery?.pack_capacity_kwh_gross}
        render={(kwh) => {
          const percentage = Math.min((kwh / 150) * 100, 100);
          return (
            <div className={styles.item}>
              <div className={styles.valueGroup}>
                <span className={styles.value}>{Math.round(kwh)}</span>
              </div>
              <span className={styles.label}>{isCompact ? 'Battery' : 'BATTERY'}</span>
              {isVisual && (
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
                </div>
              )}
            </div>
          );
        }}
      />

      {/* 0-100 km/h acceleration */}
      <DataField
        value={vehicle.performance?.acceleration_0_100_kmh_s}
        render={(accel) => {
          // Invert logic: smaller is better (faster). Max 15s, fast 2s.
          // 15s -> 0%, 2s -> 100%
          const percentage = Math.max(0, Math.min(((15 - accel) / (15 - 2)) * 100, 100));

          return (
            <div className={styles.item}>
              <div className={styles.valueGroup}>
                <span className={styles.value}>{accel}s</span>
              </div>
              <span className={styles.label}>{isCompact ? '0-100 km/h' : '0-100 KM/H'}</span>
              {isVisual && (
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
