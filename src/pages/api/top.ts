import { NextApiRequest, NextApiResponse } from "next";
import { getChartTops } from "@/lib/lastfm";
import { parsePeriod } from "@/lib/period";
import { logApiError } from "@/lib/apiError";
import { CHART_PAGE_CACHE_CONTROL } from "@/lib/ttlCache";

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
    res.setHeader("Cache-Control", CHART_PAGE_CACHE_CONTROL);
    res.status(200).json(payload);
  } catch (error) {
    logApiError("/api/top", error);
    res.status(500).json({ message: "Failed to fetch top charts" });
  }
}
