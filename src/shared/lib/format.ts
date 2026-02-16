/**
 * Format a number as currency (USD default).
 * @param value - The number to format.
 * @param currency - The currency code (default: 'USD').
 * @param locale - The locale string (default: 'en-US').
 */
export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with compact notation (e.g., 1.5k, 2M).
 */
export function formatCompactNumber(
  value: number,
  locale: string = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format distance in kilometers.
 */
export function formatDistance(km: number, locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "kilometer",
    unitDisplay: "short",
    maximumFractionDigits: 0,
  }).format(km);
}

/**
 * Format power in kilowatts.
 */
export function formatPower(kw: number, locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "kilowatt",
    unitDisplay: "short",
    maximumFractionDigits: 0,
  }).format(kw);
}

/**
 * Format energy in kilowatt-hours.
 */
export function formatEnergy(kwh: number, locale: string = "en-US"): string {
  // 'kilowatt-hour' unit might not be supported in all environments/older browsers reliably as a unit,
  // but often works. Usage: unit: "kilowatt-hour"
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "kilowatt-hour",
    unitDisplay: "short",
    maximumFractionDigits: 1,
  }).format(kwh);
}

/**
 * Format duration in seconds.
 */
export function formatDuration(
  seconds: number,
  locale: string = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "second",
    unitDisplay: "narrow",
    maximumFractionDigits: 1,
  }).format(seconds);
}
