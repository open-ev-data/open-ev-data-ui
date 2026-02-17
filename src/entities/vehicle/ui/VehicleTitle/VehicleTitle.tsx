import type { Vehicle } from '../../model/vehicle.types';
import { generateMakeHue } from '@/shared/lib/color-generator';

interface VehicleTitleProps {
  vehicle: Vehicle;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
}

export function VehicleTitle({ vehicle, className, as: Component = 'span' }: VehicleTitleProps) {
  const makeName = vehicle.make.name;
  const modelName = vehicle.model.name;
  const variantName = vehicle.variant?.name === 'Base' ? '' : vehicle.variant?.name;
  const year = vehicle.year;

  const hue = generateMakeHue(makeName);

  return (
    <Component className={className}>
      <span
        style={{
          color: `hsl(${hue}, 100%, 50%)`,
          textShadow: `0 0 10px hsla(${hue}, 100%, 50%, 0.3)`,
          fontWeight: 'bold',
        }}
      >
        {makeName}
      </span>
      {` ${modelName}${variantName ? ` ${variantName}` : ''} ${year}`}
    </Component>
  );
}
