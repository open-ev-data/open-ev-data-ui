import type { Vehicle } from '../../model/vehicle.types';
import { VehicleTitle } from '../VehicleTitle/VehicleTitle';
import styles from './VehicleHeader.module.css';

interface VehicleHeaderProps {
  vehicle: Vehicle;
}

export const VehicleHeader = ({ vehicle }: VehicleHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleRow}>
        <VehicleTitle vehicle={vehicle} as="h1" className={styles.title} />
        <div className={styles.badges}>
          <span className={styles.typeBadge}>{vehicle.vehicle_type.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  );
};
