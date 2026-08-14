/**
 * Date / number formatting helpers used across the app.
 */

export const formatTrackDate = (uts: string): string => {
  const date = new Date(parseInt(uts, 10) * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString();
};

export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

export const getCurrentDate = (): Date => new Date();

export type ArtistChartStats = {
  totalPlays: number;
  artistCount: number;
  topSharePercent: number;
  top5SharePercent: number;
};

/** Derive glance stats from ranked playcounts */
export const getArtistChartStats = (
  playcounts: number[]
): ArtistChartStats => {
  const totalPlays = playcounts.reduce((sum, n) => sum + n, 0);
  const artistCount = playcounts.length;
  const topSharePercent =
    totalPlays > 0 && playcounts[0]
      ? Math.round((playcounts[0] / totalPlays) * 100)
      : 0;
  const top5Plays = playcounts.slice(0, 5).reduce((sum, n) => sum + n, 0);
  const top5SharePercent =
    totalPlays > 0 ? Math.round((top5Plays / totalPlays) * 100) : 0;

  return { totalPlays, artistCount, topSharePercent, top5SharePercent };
};
