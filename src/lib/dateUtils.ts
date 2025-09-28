/**
 * Date utility functions for formatting dates throughout the application
 */

/**
 * Formats a Unix timestamp (in seconds) to a readable date string
 * @param uts - Unix timestamp as string
 * @returns Formatted date string (e.g., "Dec 15, 2:30 PM")
 */
export const formatTrackDate = (uts: string): string => {
  const date = new Date(parseInt(uts) * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formats a Date object to a time string
 * @param date - Date object
 * @returns Formatted time string (e.g., "2:30:45 PM")
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString();
};

/**
 * Formats a Date object to a date string
 * @param date - Date object
 * @returns Formatted date string (e.g., "12/15/2023")
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

/**
 * Formats a Date object to a full date and time string
 * @param date - Date object
 * @returns Formatted date and time string (e.g., "12/15/2023, 2:30:45 PM")
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString();
};

/**
 * Formats a number to a locale-specific string with commas
 * @param value - Number to format
 * @returns Formatted number string (e.g., "1,234")
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

/**
 * Gets a relative time string (e.g., "2 minutes ago", "1 hour ago")
 * @param date - Date object
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  return formatDate(date);
};

/**
 * Creates a new Date object for the current time
 * @returns Current Date object
 */
export const getCurrentDate = (): Date => {
  return new Date();
};
