import { format, parseISO, isValid, differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import { DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT } from '../constants';

export const formatDate = (
  date: string | Date | null | undefined,
  formatStr: keyof typeof DATE_FORMAT = 'FULL'
): string => {
  if (!date) return '';

  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, DATE_FORMAT[formatStr]);
  } catch (error) {
    return '';
  }
};

export const formatTime = (
  date: string | Date | null | undefined,
  includeSeconds = false
): string => {
  if (!date) return '';

  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, DATE_FORMAT.TIME);
  } catch (error) {
    return '';
  }
};

export const formatDateTime = (
  date: string | Date | null | undefined,
  includeSeconds = false
): string => {
  if (!date) return '';

  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, DATE_FORMAT.DATETIME);
  } catch (error) {
    return '';
  }
};

export const calculateAge = (birthDate: string | Date): number => {
  if (!birthDate) return 0;
  const parsedDate = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  return isValid(parsedDate) ? differenceInYears(new Date(), parsedDate) : 0;
};

export const calculateExperience = (startDate: string | Date): {
  years: number;
  months: number;
  days: number;
} => {
  if (!startDate) return { years: 0, months: 0, days: 0 };
  
  const parsedDate = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  if (!isValid(parsedDate)) return { years: 0, months: 0, days: 0 };

  const now = new Date();
  const years = differenceInYears(now, parsedDate);
  const months = differenceInMonths(now, parsedDate) % 12;
  const days = differenceInDays(now, parsedDate) % 30;

  return { years, months, days };
};

export const formatExperience = (startDate: string | Date): string => {
  const { years, months, days } = calculateExperience(startDate);
  const parts = [];

  if (years > 0) {
    parts.push(`${years} year${years !== 1 ? 's' : ''}`);
  }
  if (months > 0) {
    parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  }
  if (days > 0 && years === 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  }

  return parts.join(', ') || '0 days';
};

export const isValidDate = (date: string | Date | null | undefined): boolean => {
  if (!date) return false;

  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate);
  } catch (error) {
    return false;
  }
}; 