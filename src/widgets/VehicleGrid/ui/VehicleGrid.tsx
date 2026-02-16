import type { Vehicle } from '@/entities/vehicle';
import { VehicleCard } from '@/entities/vehicle';

import { Button } from '@/shared/ui/Button/Button';
import { cn } from '@/shared/lib/cn';
import styles from './VehicleGrid.module.css';

interface VehicleGridProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onCompare?: (vehicle: Vehicle) => void;
  className?: string;
}

import { VehicleCardSkeleton } from '@/entities/vehicle';

// ... imports

export function VehicleGrid({
  vehicles,
  isLoading,
  error,
  onRetry,
  onCompare,
  className,
}: VehicleGridProps) {
  if (isLoading) {
    return (
      <div className={cn(styles.grid, className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Failed to load vehicles</p>
        <Button onClick={onRetry} variant="primary" className={styles.retryButton}>
          Retry
        </Button>
      </div>
    );
  }

  if (!vehicles.length) {
    return (
      <div className={styles.empty}>
        <p>No vehicles found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className={cn(styles.grid, className)}>
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.unique_code}
          vehicle={vehicle}
          onCompare={onCompare}
          variant="grid"
        />
      ))}
    </div>
  );
}
