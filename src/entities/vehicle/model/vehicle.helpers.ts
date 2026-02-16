/**
 * Helper functions for vehicle domain entities.
 */
import type { Vehicle } from './vehicle.types';
import { getVehicleTypeImage } from '@/shared/lib/vehicle-image-mapper';

/**
 * Generates a full display title for a vehicle.
 * Format: "Make Model Variant Year"
 */
export function getVehicleTitle(vehicle: Vehicle): string {
  const variantName = vehicle.variant?.name === 'Base' ? '' : vehicle.variant?.name;
  const parts = [vehicle.make.name, vehicle.model.name, variantName, vehicle.year];
  return parts.filter(Boolean).join(' ');
}

/**
 * Resolves the vehicle image URL with a type-based fallback.
 */
export function getVehicleImage(vehicle: Vehicle): string {
  if (vehicle.images?.exterior_url) {
    return vehicle.images.exterior_url;
  }
  // Use vehicle type image as fallback
  return getVehicleTypeImage(vehicle.vehicle_type);
}

/**
 * Returns the main range value (WLTP preferred, then EPA, then others).
 */
export function getVehicleRange(vehicle: Vehicle): string {
  const rated = vehicle.range.rated;
  if (!rated || rated.length === 0) return '—';

  const wltp = rated.find((r) => r.cycle === 'wltp');
  const epa = rated.find((r) => r.cycle === 'epa');
  const any = rated[0];

  const bestData = wltp || epa || any;
  return `${Math.round(bestData.range_km)} km (${bestData.cycle.toUpperCase()})`;
}

/**
 * Formats the charging power (AC/DC).
 */
export function getChargingSpecs(vehicle: Vehicle): { ac: string; dc: string } {
  const acPower = vehicle.charging?.ac?.max_power_kw;
  const dcPower = vehicle.charging?.dc?.max_power_kw;

  return {
    ac: acPower ? `${acPower} kW` : '—',
    dc: dcPower ? `${dcPower} kW` : '—',
  };
}
