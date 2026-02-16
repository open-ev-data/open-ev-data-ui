import type { Vehicle } from '../../model/vehicle.types';
import { DataField } from '@/shared/lib/data-presence';
import { formatCurrency, formatDistance } from '@/shared/lib/format';
import styles from './SpecsPills.module.css';

interface SpecsPillsProps {
  vehicle: Vehicle;
}

export const SpecsPills = ({ vehicle }: SpecsPillsProps) => {
  return (
    <div className={styles.container}>
      {/* Price */}
      <DataField
        value={vehicle.pricing?.msrp?.[0]}
        render={(price) => (
          <div className={styles.pill}>
            <span className={styles.value}>{formatCurrency(price.amount, price.currency)}</span>
            <span className={styles.label}>Price</span>
          </div>
        )}
      />

      {/* Range (WLTP preferably, or first available) */}
      <DataField
        value={vehicle.range?.rated?.[0]} // Assuming first is generic or WLTP roughly
        render={(range) => (
          <div className={styles.pill}>
            <span className={styles.value}>{formatDistance(range.range_km)}</span>
            <span className={styles.label}>Range</span>
          </div>
        )}
      />

      {/* Battery */}
      <DataField
        value={vehicle.battery?.pack_capacity_kwh_net}
        render={(capacity) => (
          <div className={styles.pill}>
            <span className={styles.value}>{capacity.toFixed(1)} kWh</span>
            <span className={styles.label}>Battery</span>
          </div>
        )}
      />

      {/* 0-100 km/h */}
      <DataField
        value={vehicle.performance?.acceleration_0_100_kmh_s}
        render={(accel) => (
          <div className={styles.pill}>
            <span className={styles.value}>{accel.toFixed(1)}s</span>
            <span className={styles.label}>0-100 km/h</span>
          </div>
        )}
      />
    </div>
  );
};
