import type { Vehicle } from '@/entities/vehicle';
import { RadarChart, BarChart } from '@/shared/ui/Charts';
import { hasData } from '@/shared/lib/data-presence';
import styles from './ComparisonVisualizations.module.css';

interface ComparisonVisualizationsProps {
  vehicles: Vehicle[];
}

export const ComparisonVisualizations = ({ vehicles }: ComparisonVisualizationsProps) => {
  // Prepare radar chart data (normalized 0-100 scale)
  const radarData = [
    {
      metric: 'Range',
      ...Object.fromEntries(
        vehicles.map((v) => [
          v.unique_code,
          normalizeValue(v.range?.rated?.[0]?.range_km || 0, 0, 800),
        ])
      ),
    },
    {
      metric: 'Speed',
      ...Object.fromEntries(
        vehicles.map((v) => [
          v.unique_code,
          normalizeValue(v.performance?.top_speed_kmh || 0, 0, 250),
        ])
      ),
    },
    {
      metric: 'Efficiency',
      ...Object.fromEntries(
        vehicles.map((v) => [
          v.unique_code,
          100 - normalizeValue(v.efficiency?.energy_consumption_wh_per_km || 0, 100, 300),
        ])
      ),
    },
    {
      metric: 'Charging',
      ...Object.fromEntries(
        vehicles.map((v) => [
          v.unique_code,
          normalizeValue(v.charging?.dc?.max_power_kw || 0, 0, 350),
        ])
      ),
    },
  ];

  // Calculate how many metrics have data
  const metricsWithData = radarData.filter((metric) =>
    vehicles.some((v) => {
      const value = metric[v.unique_code as keyof typeof metric];
      return hasData(value);
    })
  ).length;

  // Prepare efficiency bar chart data
  const efficiencyData = vehicles
    .filter((v) => hasData(v.efficiency?.energy_consumption_wh_per_km))
    .map((v) => ({
      name: `${v.make.name} ${v.model.name}`,
      efficiency: v.efficiency?.energy_consumption_wh_per_km || 0,
    }));

  const vehicleColors = ['var(--chart-cyan)', 'var(--chart-green)', 'var(--chart-teal)'];

  const radarVehicles = vehicles.map((v, index) => ({
    code: v.unique_code,
    color: vehicleColors[index % vehicleColors.length],
    name: `${v.make.name} ${v.model.name}`,
  }));

  const showRadar = metricsWithData >= 3;
  const showEfficiency = efficiencyData.length > 0;

  if (!showRadar && !showEfficiency) return null;

  return (
    <div className={styles.container}>
      {showRadar && (
        <div className={styles.chartSection}>
          <h3 className={styles.chartTitle}>Performance Comparison</h3>
          <RadarChart data={radarData} vehicles={radarVehicles} height={300} />
        </div>
      )}

      {showEfficiency && (
        <div className={styles.chartSection}>
          <h3 className={styles.chartTitle}>Energy Efficiency</h3>
          <BarChart
            data={efficiencyData}
            xAxisKey="name"
            bars={[{ key: 'efficiency', name: 'Wh/km' }]}
            height={250}
            barColors={vehicleColors.slice(0, vehicles.length)}
          />
        </div>
      )}
    </div>
  );
};

// Normalize value to 0-100 scale
function normalizeValue(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}
