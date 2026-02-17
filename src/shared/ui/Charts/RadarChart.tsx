import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

export interface RadarChartProps {
  data: {
    metric: string;
    [key: string]: number | string;
  }[];
  vehicles: {
    code: string;
    color: string;
    name: string;
  }[];
  height?: number;
}

export const RadarChart = ({ data, vehicles, height = 300 }: RadarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="var(--border-subtle)" />
        <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} axisLine={false} tick={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
          }}
          itemStyle={{ color: 'var(--text-primary)' }}
        />
        <Legend
          wrapperStyle={{
            color: 'var(--text-primary)',
            fontSize: '14px',
          }}
        />
        {vehicles.map((vehicle) => (
          <Radar
            key={vehicle.code}
            name={vehicle.name}
            dataKey={vehicle.code}
            stroke={vehicle.color}
            fill={vehicle.color}
            fillOpacity={0.25}
            strokeWidth={2}
          />
        ))}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};
