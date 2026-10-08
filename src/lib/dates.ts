export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/** "2026-08" → "August 2026". */
export function monthYear(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number);
  return `${MONTHS[month! - 1]} ${year}`;
}

/** "2026-08" → "2026". */
export const yearOf = (yearMonth: string): string => yearMonth.slice(0, 4);
