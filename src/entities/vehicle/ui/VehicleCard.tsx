import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Vehicle } from '../model/vehicle.types';
import { getVehicleTitle } from '../model/vehicle.helpers';
import { getVehicleTypeImage } from '@/shared/lib/vehicle-image-mapper';
import { generateMakeHue } from '@/shared/lib/color-generator';
import { Card } from '@/shared/ui/Card/Card';
import { Badge } from '@/shared/ui/Badge/Badge';
import { Button } from '@/shared/ui/Button/Button';
import { VehicleSpecsTable } from './VehicleSpecsTable';
import { VehicleTitle } from './VehicleTitle/VehicleTitle';
import { useFavorites } from '@/features/vehicle-favorites';
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
  const { isFavorite, toggleFavorite } = useFavorites();
  const title = getVehicleTitle(vehicle);
  // Use the standardized type image instead of the specific vehicle image
  const imageUrl = getVehicleTypeImage(vehicle.vehicle_type);
  const hue = generateMakeHue(vehicle.make.name);

  const detailHref = `/vehicles/${vehicle.unique_code}`;
  const isFav = isFavorite(vehicle.unique_code);

  return (
    <Card
      className={cn(
        styles.card,
        variant === 'list' ? styles.list : styles.grid,
        isSelected && styles.selected,
        className
      )}
    >
      <Link
        to={detailHref}
        className={styles.imageContainer}
        style={{ '--vehicle-hue': hue } as React.CSSProperties}
      >
        <img src={imageUrl} alt={title} className={styles.image} loading="lazy" />
        {/* Absolute positioned badges could go here (e.g. New, Sale) */}
        <button
          className={cn(styles.favoriteButton, isFav && styles.favoriteActive)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(vehicle.unique_code);
          }}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={styles.heartIcon}
            fill={isFav ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </button>
      </Link>

      <div className={styles.content}>
        <div className={styles.titleGroup}>
          <Link to={detailHref} className={styles.titleLink}>
            <VehicleTitle vehicle={vehicle} as="h3" className={styles.title} />
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
        </div>
      </div>
    </Card>
  );
}
