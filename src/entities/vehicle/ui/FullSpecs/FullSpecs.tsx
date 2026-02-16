import type { Vehicle } from '../../model/vehicle.types';
import { hasData } from '@/shared/lib/data-presence';
import styles from './FullSpecs.module.css';

interface FullSpecsProps {
  vehicle: Vehicle;
}

export const FullSpecs = ({ vehicle }: FullSpecsProps) => {
  return (
    <div className={styles.container}>
      {/* Body & Chassis */}
      {hasData(vehicle.body) && (
        <details className={styles.accordion} open>
          <summary className={styles.summary}>Body & Chassis</summary>
          <div className={styles.content}>
            <SpecRow label="Body Style" value={vehicle.body?.style} />
            <SpecRow label="Doors" value={vehicle.body?.doors} />
            <SpecRow label="Seats" value={vehicle.body?.seats} />
            <SpecRow label="Drag Coefficient" value={vehicle.body?.drag_coefficient_cd} />
          </div>
        </details>
      )}

      {/* Dimensions */}
      {hasData(vehicle.dimensions) && (
        <details className={styles.accordion}>
          <summary className={styles.summary}>Dimensions</summary>
          <div className={styles.content}>
            <SpecRow label="Length" value={vehicle.dimensions?.length_mm} unit="mm" />
            <SpecRow label="Width" value={vehicle.dimensions?.width_mm} unit="mm" />
            <SpecRow label="Height" value={vehicle.dimensions?.height_mm} unit="mm" />
            <SpecRow label="Wheelbase" value={vehicle.dimensions?.wheelbase_mm} unit="mm" />
            <SpecRow
              label="Ground Clearance"
              value={vehicle.dimensions?.ground_clearance_mm}
              unit="mm"
            />
          </div>
        </details>
      )}

      {/* Weights */}
      {hasData(vehicle.weights) && (
        <details className={styles.accordion}>
          <summary className={styles.summary}>Weights</summary>
          <div className={styles.content}>
            <SpecRow label="Curb Weight" value={vehicle.weights?.curb_weight_kg} unit="kg" />
            <SpecRow
              label="Gross Weight"
              value={vehicle.weights?.gross_vehicle_weight_kg}
              unit="kg"
            />
            <SpecRow label="Max Payload" value={vehicle.weights?.max_payload_kg} unit="kg" />
          </div>
        </details>
      )}

      {/* Performance */}
      {hasData(vehicle.performance) && (
        <details className={styles.accordion}>
          <summary className={styles.summary}>Performance</summary>
          <div className={styles.content}>
            <SpecRow
              label="0-100 km/h"
              value={vehicle.performance?.acceleration_0_100_kmh_s}
              unit="s"
            />
            <SpecRow label="Top Speed" value={vehicle.performance?.top_speed_kmh} unit="km/h" />
          </div>
        </details>
      )}

      {/* Efficiency */}
      {hasData(vehicle.efficiency) && (
        <details className={styles.accordion}>
          <summary className={styles.summary}>Efficiency</summary>
          <div className={styles.content}>
            <SpecRow
              label="Consumption (WLTP)"
              value={vehicle.efficiency?.energy_consumption_wh_per_km}
              unit="Wh/km"
            />
          </div>
        </details>
      )}

      {/* Capacity */}
      {hasData(vehicle.capacity) && (
        <details className={styles.accordion}>
          <summary className={styles.summary}>Capacity</summary>
          <div className={styles.content}>
            <SpecRow label="Cargo Volume" value={vehicle.capacity?.cargo_l} unit="L" />
            <SpecRow label="Frunk Volume" value={vehicle.capacity?.frunk_l} unit="L" />
            <SpecRow label="Towing (Braked)" value={vehicle.capacity?.towing_braked_kg} unit="kg" />
            <SpecRow
              label="Towing (Unbraked)"
              value={vehicle.capacity?.towing_unbraked_kg}
              unit="kg"
            />
          </div>
        </details>
      )}

      {/* Wheels & Tires */}
      {hasData(vehicle.wheels_tires) && (
        <details className={styles.accordion}>
          <summary className={styles.summary}>Wheels & Tires</summary>
          <div className={styles.content}>
            <SpecRow label="Tire Sizes" value={vehicle.wheels_tires?.tire_sizes?.join(', ')} />
            <SpecRow
              label="Wheel Size"
              value={vehicle.wheels_tires?.standard_wheel_size_in}
              unit="in"
            />
          </div>
        </details>
      )}
    </div>
  );
};

const SpecRow = ({ label, value, unit }: { label: string; value: unknown; unit?: string }) => {
  if (!hasData(value)) return null;

  let displayValue: string | number = value as string | number;
  if (typeof value === 'number') {
    displayValue = value.toLocaleString();
  }

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {displayValue} {unit}
      </span>
    </div>
  );
};
