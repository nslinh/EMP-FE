export const formatCurrency = (
  value: number | null | undefined,
  locale = 'en-US',
  currency = 'USD'
): string => {
  if (value === null || value === undefined) return '';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatNumber = (
  value: number | null | undefined,
  locale = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string => {
  if (value === null || value === undefined) return '';

  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatPercentage = (
  value: number | null | undefined,
  locale = 'en-US',
  decimals = 2
): string => {
  if (value === null || value === undefined) return '';

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const calculatePercentage = (
  value: number,
  total: number,
  decimals = 2
): number => {
  if (total === 0) return 0;
  return Number((value / total).toFixed(decimals));
};

export const roundNumber = (value: number, decimals = 2): number => {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};

export const sumArray = (array: number[]): number => {
  return array.reduce((sum, value) => sum + value, 0);
};

export const averageArray = (array: number[]): number => {
  if (array.length === 0) return 0;
  return sumArray(array) / array.length;
}; 