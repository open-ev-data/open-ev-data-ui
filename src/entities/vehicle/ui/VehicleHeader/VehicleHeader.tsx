import type { Vehicle } from '../../model/vehicle.types';
import { getVehicleTitle } from '../../model/vehicle.helpers';
import styles from './VehicleHeader.module.css';

interface VehicleHeaderProps {
  vehicle: Vehicle;
}

export const VehicleHeader = ({ vehicle }: VehicleHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{getVehicleTitle(vehicle)}</h1>
        <div className={styles.badges}>
          <span className={styles.typeBadge}>{vehicle.vehicle_type.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  );
};
