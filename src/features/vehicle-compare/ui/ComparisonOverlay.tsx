import { useNavigate } from 'react-router-dom';
import { X, Trash2 } from 'lucide-react';
import { useComparison } from '../model/comparison-context';
import { Button } from '@/shared/ui/Button/Button';
import { getVehicleTitle, VehicleSpecsTable } from '@/entities/vehicle';
import { getVehicleTypeImage } from '@/shared/lib/vehicle-image-mapper';
import { generateMakeHue } from '@/shared/lib/color-generator';
import { cn } from '@/shared/lib/cn';
import styles from './ComparisonOverlay.module.css';

interface ComparisonOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function ComparisonOverlay({ isOpen, onClose, className }: ComparisonOverlayProps) {
  const navigate = useNavigate();
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
              <div
                key={vehicle.unique_code}
                className={styles.item}
                style={
                  { '--vehicle-hue': generateMakeHue(vehicle.make.name) } as React.CSSProperties
                }
              >
                <div className={styles.itemHeader}>
                  <img
                    src={getVehicleTypeImage(vehicle.vehicle_type)}
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
                    className={styles.removeButton}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className={styles.itemSpecs}>
                  <VehicleSpecsTable vehicle={vehicle} variant="visual" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <Button variant="ghost" onClick={clearComparison} disabled={!comparedVehicles.length}>
          Clear All
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onClose();
            const searchParams = new URLSearchParams();
            searchParams.set('vehicles', comparedVehicles.map((v) => v.unique_code).join(','));
            navigate(`/compare?${searchParams.toString()}`);
          }}
          disabled={!comparedVehicles.length}
        >
          Full Comparison
        </Button>
      </div>
    </div>
  );
}
