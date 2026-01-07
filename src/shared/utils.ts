/**
 * Formats a date to ISO string.
 * 
 * @param date - Date to format
 * @returns ISO string representation
 */
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

/**
 * Calculates the difference between two dates in seconds.
 * 
 * @param start - Start date
 * @param end - End date
 * @returns Difference in seconds
 */
export const getDurationSeconds = (start: Date, end: Date): number => {
  return Math.floor((end.getTime() - start.getTime()) / 1000);
};

/**
 * Calculates reading speed in pages per hour.
 * 
 * @param pagesRead - Number of pages read
 * @param durationSeconds - Duration in seconds
 * @returns Reading speed in pages per hour
 */
export const calculateReadingSpeed = (pagesRead: number, durationSeconds: number): number => {
  if (durationSeconds === 0) {
    return 0;
  }
  return Math.round((pagesRead / durationSeconds) * 3600);
};

/**
 * Formats reading speed as a human-readable string.
 * 
 * @param pagesRead - Number of pages read
 * @param durationSeconds - Duration in seconds
 * @returns Formatted speed string (e.g., "25 pages/hour")
 */
export const formatReadingSpeed = (pagesRead: number, durationSeconds: number): string => {
  const speed = calculateReadingSpeed(pagesRead, durationSeconds);
  return `${speed} pages/hour`;
};

/**
 * Gets the hour of day from a date in a specific timezone.
 * 
 * @param date - Date to extract hour from
 * @param timezone - IANA timezone string (e.g., 'Asia/Kolkata')
 * @returns Hour of day (0-23)
 */
export const getHourOfDay = (date: Date, timezone: string = 'Asia/Kolkata'): number => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false,
  });
  return parseInt(formatter.format(date), 10);
};

/**
 * Groups items by a key function.
 * 
 * @param items - Array of items to group
 * @param keyFn - Function to extract key from item
 * @returns Map of keys to arrays of items
 */
export const groupBy = <T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Map<K, T[]> => {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const group = groups.get(key) || [];
    group.push(item);
    groups.set(key, group);
  }
  return groups;
};

