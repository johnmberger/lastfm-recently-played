import { NextApiRequest, NextApiResponse } from "next";
import { getChartTops } from "@/lib/lastfm";
import { parsePeriod } from "@/lib/period";

/** Legacy endpoint — same payload as /api/top */
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
    res.status(200).json(payload);
  } catch (error) {
    const err = error as { message?: string; stack?: string };
    console.error("/api/top-this-week error", {
      message: err?.message,
      stack: err?.stack,
    });
    res.status(500).json({ message: "Failed to fetch top charts" });
  }
}
