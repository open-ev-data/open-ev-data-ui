import { X, Trash2 } from 'lucide-react';
import { useComparison } from '../model/use-comparison';
import { Button } from '@/shared/ui/Button/Button';
import { getVehicleImage, getVehicleTitle } from '@/entities/vehicle';
import { cn } from '@/shared/lib/cn';
import styles from './ComparisonOverlay.module.css';

interface ComparisonOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function ComparisonOverlay({ isOpen, onClose, className }: ComparisonOverlayProps) {
  const { comparedVehicles, removeFromCompare, clearComparison } = useComparison();

  return (
    <div className={cn(styles.overlay, isOpen && styles.overlayOpen, className)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Compare ({comparedVehicles.length})</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      <div className={styles.content}>
        {comparedVehicles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No vehicles selected.</p>
            <p className="text-secondary">Add vehicles to compare them side by side.</p>
          </div>
        ) : (
          <div className={styles.vehicleList}>
            {comparedVehicles.map((vehicle) => (
              <div key={vehicle.unique_code} className={styles.item}>
                <img
                  src={getVehicleImage(vehicle)}
                  alt={vehicle.model.name}
                  className={styles.thumb}
                />
                <div className={styles.info}>
                  <span className={styles.name}>{getVehicleTitle(vehicle)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCompare(vehicle.unique_code)}
                  aria-label="Remove"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <Button variant="ghost" onClick={clearComparison} disabled={!comparedVehicles.length}>
          Clear All
        </Button>
        <Button variant="primary" onClick={onClose} disabled={!comparedVehicles.length}>
          Full Comparison
        </Button>
      </div>
    </div>
  );
}
