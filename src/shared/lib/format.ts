export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (
  value: number,
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions
) => {
  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatDistance = (km: number, unit: 'km' | 'mi' = 'km') => {
  // Simple formatter for now, can be expanded for unit conversion
  return `${formatNumber(km)} ${unit}`;
};

export const formatPower = (kw: number) => {
  return `${formatNumber(kw)} kW`;
};
