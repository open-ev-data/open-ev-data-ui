import type { Vehicle } from '../../model/vehicle.types';
import styles from './VehicleImage.module.css';

interface VehicleImageProps {
  vehicle: Vehicle;
}

export const VehicleImage = ({ vehicle }: VehicleImageProps) => {
  const imageUrl = vehicle.images?.exterior_url;
  const altText = `${vehicle.make.name} ${vehicle.model.name} ${vehicle.trim.name}`;

  if (!imageUrl) {
    return (
      <div className={styles.placeholder}>
        <span className={styles.placeholderText}>No Image Available</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <img src={imageUrl} alt={altText} className={styles.image} loading="eager" />
    </div>
  );
};
