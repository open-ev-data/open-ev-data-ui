import type { Vehicle } from '@/entities/vehicle';
import { DataField, hasData } from '@/shared/lib/data-presence';
import { formatCurrency, formatDistance } from '@/shared/lib/format';
import styles from './CompareTable.module.css';

interface CompareTableProps {
  vehicles: Vehicle[];
  onRemoveVehicle: (code: string) => void;
}

export const CompareTable = ({ vehicles, onRemoveVehicle }: CompareTableProps) => {
  if (vehicles.length === 0) return null;

  // Helper to find best value (lowest price, highest range, etc.)
  const findBestValue = (
    field: (v: Vehicle) => number | undefined,
    compare: 'min' | 'max'
  ): number | undefined => {
    const values = vehicles.map(field).filter((v): v is number => v !== undefined);
    if (values.length === 0) return undefined;
    return compare === 'min' ? Math.min(...values) : Math.max(...values);
  };

  const bestPrice = findBestValue((v) => v.pricing?.msrp?.[0]?.amount, 'min');
  const bestRange = findBestValue((v) => v.range?.rated?.[0]?.range_km, 'max');
  const best0to100 = findBestValue((v) => v.performance?.acceleration_0_100_kmh_s, 'min');

  const isBest = (value: number | undefined, bestValue: number | undefined) => {
    return value !== undefined && value === bestValue;
  };

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        {/* Vehicle Headers */}
        <div className={styles.headerRow}>
          <div className={styles.labelCell}></div>
          {vehicles.map((vehicle) => (
            <div key={vehicle.unique_code} className={styles.vehicleHeader}>
              <button
                onClick={() => onRemoveVehicle(vehicle.unique_code)}
                className={styles.removeButton}
                aria-label={`Remove ${vehicle.make.name} ${vehicle.model.name}`}
              >
                ×
              </button>
              {vehicle.images?.exterior_url && (
                <img
                  src={vehicle.images.exterior_url}
                  alt={`${vehicle.make.name} ${vehicle.model.name}`}
                  className={styles.vehicleImage}
                />
              )}
              <div className={styles.vehicleName}>
                {vehicle.make.name} {vehicle.model.name}
              </div>
              <div className={styles.vehicleTrim}>{vehicle.trim?.name}</div>
            </div>
          ))}
        </div>

        {/* Price Row */}
        <DataField
          value={vehicles.some((v) => hasData(v.pricing?.msrp?.[0]?.amount))}
          render={() => (
            <div className={styles.dataRow}>
              <div className={styles.labelCell}>Price</div>
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.unique_code}
                  className={`${styles.valueCell} ${
                    isBest(vehicle.pricing?.msrp?.[0]?.amount, bestPrice) ? styles.bestValue : ''
                  }`}
                >
                  <DataField
                    value={vehicle.pricing?.msrp?.[0]}
                    render={(pricing) => formatCurrency(pricing.amount, pricing.currency)}
                    fallback="—"
                  />
                </div>
              ))}
            </div>
          )}
        />

        {/* Range Row */}
        <DataField
          value={vehicles.some((v) => hasData(v.range?.rated?.[0]?.range_km))}
          render={() => (
            <div className={styles.dataRow}>
              <div className={styles.labelCell}>Range (WLTP)</div>
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.unique_code}
                  className={`${styles.valueCell} ${
                    isBest(vehicle.range?.rated?.[0]?.range_km, bestRange) ? styles.bestValue : ''
                  }`}
                >
                  <DataField
                    value={vehicle.range?.rated?.[0]?.range_km}
                    render={(range) => formatDistance(range)}
                    fallback="—"
                  />
                </div>
              ))}
            </div>
          )}
        />

        {/* Battery Capacity Row */}
        <DataField
          value={vehicles.some((v) => hasData(v.battery?.pack_capacity_kwh_net))}
          render={() => (
            <div className={styles.dataRow}>
              <div className={styles.labelCell}>Battery</div>
              {vehicles.map((vehicle) => (
                <div key={vehicle.unique_code} className={styles.valueCell}>
                  <DataField
                    value={vehicle.battery?.pack_capacity_kwh_net}
                    render={(capacity) => `${capacity.toFixed(1)} kWh`}
                    fallback="—"
                  />
                </div>
              ))}
            </div>
          )}
        />

        {/* 0-100 km/h Row */}
        <DataField
          value={vehicles.some((v) => hasData(v.performance?.acceleration_0_100_kmh_s))}
          render={() => (
            <div className={styles.dataRow}>
              <div className={styles.labelCell}>0-100 km/h</div>
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.unique_code}
                  className={`${styles.valueCell} ${
                    isBest(vehicle.performance?.acceleration_0_100_kmh_s, best0to100)
                      ? styles.bestValue
                      : ''
                  }`}
                >
                  <DataField
                    value={vehicle.performance?.acceleration_0_100_kmh_s}
                    render={(accel) => `${accel.toFixed(1)}s`}
                    fallback="—"
                  />
                </div>
              ))}
            </div>
          )}
        />

        {/* AC Charging Row */}
        <DataField
          value={vehicles.some((v) => hasData(v.charging?.ac?.max_power_kw))}
          render={() => (
            <div className={styles.dataRow}>
              <div className={styles.labelCell}>AC Charging</div>
              {vehicles.map((vehicle) => (
                <div key={vehicle.unique_code} className={styles.valueCell}>
                  <DataField
                    value={vehicle.charging?.ac?.max_power_kw}
                    render={(power) => `${power} kW`}
                    fallback="—"
                  />
                </div>
              ))}
            </div>
          )}
        />

        {/* DC Charging Row */}
        <DataField
          value={vehicles.some((v) => hasData(v.charging?.dc?.max_power_kw))}
          render={() => (
            <div className={styles.dataRow}>
              <div className={styles.labelCell}>DC Charging</div>
              {vehicles.map((vehicle) => (
                <div key={vehicle.unique_code} className={styles.valueCell}>
                  <DataField
                    value={vehicle.charging?.dc?.max_power_kw}
                    render={(power) => `${power} kW`}
                    fallback="—"
                  />
                </div>
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
};
