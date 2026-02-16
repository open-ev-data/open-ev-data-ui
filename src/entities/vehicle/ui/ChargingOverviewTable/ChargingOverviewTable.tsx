import type { Vehicle } from '../../model/vehicle.types';
import { DataField } from '@/shared/lib/data-presence';
import styles from './ChargingOverviewTable.module.css';

interface ChargingOverviewTableProps {
  vehicle: Vehicle;
}

export const ChargingOverviewTable = ({ vehicle }: ChargingOverviewTableProps) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Charging</h3>
      <div className={styles.grid}>
        {/* AC Charging */}
        <DataField
          value={vehicle.charging?.ac}
          render={(ac) => (
            <div className={styles.row}>
              <span className={styles.label}>AC Charging</span>
              <span className={styles.value}>
                {ac.max_power_kw} kW (up to {ac.phases || 1}-phase)
              </span>
            </div>
          )}
        />

        {/* DC Charging */}
        <DataField
          value={vehicle.charging?.dc}
          render={(dc) => (
            <div className={styles.row}>
              <span className={styles.label}>DC Charging</span>
              <span className={styles.value}>{dc.max_power_kw} kW</span>
            </div>
          )}
        />

        {/* Plug & Charge */}
        <DataField
          value={vehicle.charging?.protocols?.plug_and_charge}
          render={(pnc) => (
            <div className={styles.row}>
              <span className={styles.label}>Plug & Charge</span>
              <span className={styles.value}>{pnc ? 'Yes' : 'No'}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
};
