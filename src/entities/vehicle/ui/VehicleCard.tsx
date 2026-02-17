import { Link } from 'react-router-dom';
import type { Vehicle } from '../model/vehicle.types';
import { getVehicleImage, getVehicleTitle } from '../model/vehicle.helpers';
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
  isSelected?: boolean;
  className?: string;
}

export function VehicleCard({
  vehicle,
  variant = 'grid',
  onCompare,
  isSelected = false,
  className,
}: VehicleCardProps) {
  const title = getVehicleTitle(vehicle);
  const imageUrl = getVehicleImage(vehicle);
  const detailHref = `/vehicles/${vehicle.unique_code}`;

  return (
    <Card
      className={cn(
        styles.card,
        variant === 'list' ? styles.list : styles.grid,
        isSelected && styles.selected,
        className
      )}
    >
      <Link to={detailHref} className={styles.imageContainer}>
        <img src={imageUrl} alt={title} className={styles.image} loading="lazy" />
        {/* Absolute positioned badges could go here (e.g. New, Sale) */}
      </Link>

      <div className={styles.content}>
        <div className={styles.titleGroup}>
          <Link to={detailHref} className={styles.titleLink}>
            <h3 className={styles.title}>{title}</h3>
          </Link>
          <Badge variant="neutral" className={styles.typeBadge}>
            {vehicle.vehicle_type.replace('_', ' ')}
          </Badge>
        </div>

        {/* Specs Table - Compact in card */}
        <VehicleSpecsTable vehicle={vehicle} variant="compact" />

        <div className={styles.actions}>
          <Button
            variant={isSelected ? 'primary' : 'secondary'}
            size="sm"
            className={cn(styles.compareButton, isSelected && styles.compareButtonSelected)}
            onClick={() => onCompare?.(vehicle)}
          >
            {isSelected ? 'Added to Compare' : 'Compare'}
          </Button>
          {/* Favorite button could go here */}
        </div>
      </div>
    </Card>
  );
}
