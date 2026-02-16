/**
 * Helper functions for vehicle domain entities.
 */
import type { Vehicle } from './vehicle.types';

/**
 * Generates a full display title for a vehicle.
 * Format: "Year Make Model Trim [Variant]"
 */
export function getVehicleTitle(vehicle: Vehicle): string {
  const parts = [vehicle.year, vehicle.make.name, vehicle.model.name, vehicle.trim.name];

  if (vehicle.variant?.name) {
    parts.push(`(${vehicle.variant.name})`);
  }

  return parts.filter(Boolean).join(' ');
}

/**
 * Resolves the vehicle image URL with a default fallback.
 */
export function getVehicleImage(vehicle: Vehicle): string {
  if (vehicle.images?.exterior_url) {
    return vehicle.images.exterior_url;
  }
  // TODO: Add a specific placeholder asset
  return '/placeholder-vehicle.png';
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
