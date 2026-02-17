import { X } from 'lucide-react';
import type { Vehicle } from '@/entities/vehicle';
import { DataField, hasData } from '@/shared/lib/data-presence';
import { formatCurrency, formatDistance } from '@/shared/lib/format';
import { isFieldVisible } from '@/shared/config/field-visibility';
import { getVehicleTitle } from '@/entities/vehicle/model/vehicle.helpers';
import { getVehicleTypeImage } from '@/shared/lib/vehicle-image-mapper';
import { generateMakeHue } from '@/shared/lib/color-generator';
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

    const best = compare === 'min' ? Math.min(...values) : Math.max(...values);

    // Check for ties - if more than one vehicle has the best value, return undefined (no winner)
    const count = values.filter((v) => v === best).length;
    if (count > 1) return undefined;

    return best;
  };

  const bestPrice = findBestValue((v) => v.pricing?.msrp?.[0]?.amount, 'min');
  const bestRange = findBestValue((v) => v.range?.rated?.[0]?.range_km, 'max');
  const best0to100 = findBestValue((v) => v.performance?.acceleration_0_100_kmh_s, 'min');
  const bestBattery = findBestValue((v) => v.battery?.pack_capacity_kwh_net, 'max');
  const bestAC = findBestValue((v) => v.charging?.ac?.max_power_kw, 'max');
  const bestDC = findBestValue((v) => v.charging?.dc?.max_power_kw, 'max');

  const isBest = (value: number | undefined, bestValue: number | undefined) => {
    return value !== undefined && bestValue !== undefined && value === bestValue;
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.table}
        style={{ '--vehicle-count': vehicles.length } as React.CSSProperties}
      >
        {/* Vehicle Headers */}
        <div className={styles.headerRow}>
          <div className={styles.labelCell}></div>
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.unique_code}
              className={styles.vehicleHeader}
              style={{ '--vehicle-hue': generateMakeHue(vehicle.make.name) } as React.CSSProperties}
            >
              <button
                onClick={() => onRemoveVehicle(vehicle.unique_code)}
                className={styles.removeButton}
                aria-label={`Remove ${getVehicleTitle(vehicle)}`}
              >
                <X size={16} />
              </button>
              <img
                src={getVehicleTypeImage(vehicle.vehicle_type)}
                alt={getVehicleTitle(vehicle)}
                className={styles.vehicleImage}
              />
              <div className={styles.vehicleName}>{getVehicleTitle(vehicle)}</div>
              <div className={styles.vehicleTrim}>{vehicle.trim?.name}</div>
            </div>
          ))}
        </div>

        {/* Price Row */}
        {isFieldVisible('pricing') && (
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
                    <div className={styles.mobileVehicleName}>{getVehicleTitle(vehicle)}</div>
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
        )}

        {/* Range Row */}
        <DataField
          value={vehicles.some((v) => hasData(v.range?.rated?.[0]?.range_km))}
          render={() => (
            <div className={styles.dataRow}>
              <div className={styles.labelCell}>Range (WLTP)</div>
              {vehicles.map((vehicle) => {
                const range = vehicle.range?.rated?.[0]?.range_km;
                const percentage = range ? Math.min((range / 800) * 100, 100) : 0;
                return (
                  <div
                    key={vehicle.unique_code}
                    className={`${styles.valueCell} ${
                      isBest(range, bestRange) ? styles.bestValue : ''
                    }`}
                  >
                    <div className={styles.cellContent}>
                      <div className={styles.mobileVehicleName}>{getVehicleTitle(vehicle)}</div>
                      <DataField value={range} render={(r) => formatDistance(r)} fallback="—" />
                      {range && (
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        />

        {/* Battery Capacity Row */}
        <DataField
          value={vehicles.some((v) => hasData(v.battery?.pack_capacity_kwh_net))}
          render={() => (
            <div className={styles.dataRow}>
              <div className={styles.labelCell}>Battery</div>
              {vehicles.map((vehicle) => {
                const kwh = vehicle.battery?.pack_capacity_kwh_net;
                const percentage = kwh ? Math.min((kwh / 150) * 100, 100) : 0;
                return (
                  <div
                    key={vehicle.unique_code}
                    className={`${styles.valueCell} ${
                      isBest(kwh, bestBattery) ? styles.bestValue : ''
                    }`}
                  >
                    <div className={styles.cellContent}>
                      <div className={styles.mobileVehicleName}>{getVehicleTitle(vehicle)}</div>
                      <DataField
                        value={kwh}
                        render={(capacity) => `${capacity.toFixed(1)} kWh`}
                        fallback="—"
                      />
                      {kwh && (
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        />

        {/* 0-100 km/h Row */}
        <DataField
          value={vehicles.some((v) => hasData(v.performance?.acceleration_0_100_kmh_s))}
          render={() => (
            <div className={styles.dataRow}>
              <div className={styles.labelCell}>0-100 km/h</div>
              {vehicles.map((vehicle) => {
                const accel = vehicle.performance?.acceleration_0_100_kmh_s;
                // 15s -> 0%, 2s -> 100%
                const percentage = accel
                  ? Math.max(0, Math.min(((15 - accel) / (15 - 2)) * 100, 100))
                  : 0;
                return (
                  <div
                    key={vehicle.unique_code}
                    className={`${styles.valueCell} ${
                      isBest(accel, best0to100) ? styles.bestValue : ''
                    }`}
                  >
                    <div className={styles.cellContent}>
                      <div className={styles.mobileVehicleName}>{getVehicleTitle(vehicle)}</div>
                      <DataField value={accel} render={(a) => `${a.toFixed(1)}s`} fallback="—" />
                      {accel && (
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
                <div
                  key={vehicle.unique_code}
                  className={`${styles.valueCell} ${
                    isBest(vehicle.charging?.ac?.max_power_kw, bestAC) ? styles.bestValue : ''
                  }`}
                >
                  <DataField
                    value={vehicle.charging?.ac?.max_power_kw}
                    render={(power) => (
                      <>
                        <div className={styles.mobileVehicleName}>{getVehicleTitle(vehicle)}</div>
                        {`${power} kW`}
                      </>
                    )}
                    fallback={
                      <>
                        <div className={styles.mobileVehicleName}>{getVehicleTitle(vehicle)}</div>—
                      </>
                    }
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
                <div
                  key={vehicle.unique_code}
                  className={`${styles.valueCell} ${
                    isBest(vehicle.charging?.dc?.max_power_kw, bestDC) ? styles.bestValue : ''
                  }`}
                >
                  <DataField
                    value={vehicle.charging?.dc?.max_power_kw}
                    render={(power) => (
                      <>
                        <div className={styles.mobileVehicleName}>{getVehicleTitle(vehicle)}</div>
                        {`${power} kW`}
                      </>
                    )}
                    fallback={
                      <>
                        <div className={styles.mobileVehicleName}>{getVehicleTitle(vehicle)}</div>—
                      </>
                    }
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
