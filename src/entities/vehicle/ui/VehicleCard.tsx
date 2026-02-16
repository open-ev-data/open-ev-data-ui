import type { Vehicle } from '../model/vehicle.types';
import { getVehicleImage } from '../model/vehicle.helpers';
import { Card } from '@/shared/ui/Card/Card';
import { Badge } from '@/shared/ui/Badge/Badge';
import { Button } from '@/shared/ui/Button/Button';
import { VehicleSpecsTable } from './VehicleSpecsTable';
import { cn } from '@/shared/lib/cn';
import styles from './VehicleCard.module.css';

interface VehicleCardProps {
  vehicle: Vehicle;
  variant?: 'grid' | 'list';
  onCompare?: (vehicle: Vehicle) => void;
  className?: string;
}

export function VehicleCard({ vehicle, variant = 'grid', onCompare, className }: VehicleCardProps) {
  const title = `${vehicle.make.name} ${vehicle.model.name}`;
  const subtitle = `${vehicle.year} ${vehicle.trim.name} ${
    vehicle.variant?.name ? `(${vehicle.variant.name})` : ''
  }`;
  const imageUrl = getVehicleImage(vehicle);

  return (
    <Card className={cn(styles.card, variant === 'list' ? styles.list : styles.grid, className)}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={title} className={styles.image} loading="lazy" />
        {/* Absolute positioned badges could go here (e.g. New, Sale) */}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h3 className={styles.title}>{title}</h3>
            <span className={styles.subtitle}>{subtitle}</span>
          </div>
          <Badge variant="neutral">{vehicle.vehicle_type.replace('_', ' ')}</Badge>
        </div>

        {/* Specs Table - Compact in card */}
        <VehicleSpecsTable vehicle={vehicle} variant="compact" />

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="sm"
            className={styles.compareButton}
            onClick={() => onCompare?.(vehicle)}
          >
            Compare
          </Button>
          {/* Favorite button could go here */}
        </div>
      </div>
    </Card>
  );
}
