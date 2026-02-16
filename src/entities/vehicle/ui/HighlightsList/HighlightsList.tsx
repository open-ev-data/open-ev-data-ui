import type { Vehicle } from '../../model/vehicle.types';
import styles from './HighlightsList.module.css';
import { hasData } from '@/shared/lib/data-presence';

interface HighlightsListProps {
  vehicle: Vehicle;
}

export const HighlightsList = ({ vehicle }: HighlightsListProps) => {
  const highlights = [];

  // Heat Pump
  if (hasData(vehicle.battery?.heat_pump) && vehicle.battery?.heat_pump) {
    highlights.push({ label: 'Heat Pump', value: 'Yes' });
  }

  // Software/OS
  if (hasData(vehicle.software?.os)) {
    highlights.push({ label: 'Operating System', value: vehicle.software?.os });
  }

  // OTA Updates
  if (hasData(vehicle.software?.ota_supported) && vehicle.software?.ota_supported) {
    highlights.push({ label: 'OTA Updates', value: 'Supported' });
  }

  if (highlights.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Highlights</h3>
      <ul className={styles.list}>
        {highlights.map((item, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.check}>✓</span>
            <span className={styles.label}>{item.label}</span>
            {item.value && <span className={styles.value}>: {item.value}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
