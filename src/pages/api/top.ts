import { NextApiRequest, NextApiResponse } from "next";
import { getChartTops } from "@/lib/lastfm";
import { parsePeriod } from "@/lib/period";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const period = parsePeriod(req.query.period);
    const payload = await getChartTops(period);
    console.log("/api/top success", {
      period,
      artists: payload.artists.length,
      albums: payload.albums.length,
      tracks: payload.tracks.length,
    });
    res.status(200).json(payload);
  } catch (error) {
    const err = error as any;
    console.error("/api/top error", {
      message: err?.message,
      stack: err?.stack,
    });
    res.status(500).json({ message: "Failed to fetch top charts" });
  }
}
