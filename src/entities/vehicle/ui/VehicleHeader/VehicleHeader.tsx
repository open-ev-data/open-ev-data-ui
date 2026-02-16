import type { Vehicle } from '../../model/vehicle.types';
import styles from './VehicleHeader.module.css'; // We'll assume CSS modules for now or use inline styles/classes

interface VehicleHeaderProps {
  vehicle: Vehicle;
}

export const VehicleHeader = ({ vehicle }: VehicleHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>
          {vehicle.make.name} {vehicle.model.name}{' '}
          <span className={styles.trim}>{vehicle.trim.name}</span>
        </h1>
        <div className={styles.badges}>
          <span className={styles.yearBadge}>{vehicle.year}</span>
          <span className={styles.typeBadge}>{vehicle.vehicle_type}</span>
        </div>
      </div>
      {vehicle.variant && <div className={styles.variant}>{vehicle.variant.name}</div>}
    </div>
  );
};
