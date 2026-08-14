import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ChartPeriod,
  DEFAULT_CHART_PERIOD,
  isChartPeriod,
} from "@/lib/period";

/**
 * Tracks in-flight duration navigations for /top and /me.
 * Use displayPeriod for optimistic UI while SSR catches up.
 */
export function useDurationPending(
  pathname: string,
  period: ChartPeriod
): {
  isPending: boolean;
  displayPeriod: ChartPeriod;
  selectPeriod: (next: ChartPeriod) => void;
} {
  const router = useRouter();
  const [pendingPeriod, setPendingPeriod] = useState<ChartPeriod | null>(null);

  // Clear optimistic pending once the page period catches up
  if (pendingPeriod !== null && pendingPeriod === period) {
    setPendingPeriod(null);
  }

  useEffect(() => {
    const clear = () => setPendingPeriod(null);
    const onStart = (url: string) => {
      const [path, query = ""] = url.split("?");
      if (path !== pathname) return;
      const params = new URLSearchParams(query);
      const next = params.get("period");
      if (next && isChartPeriod(next)) {
        setPendingPeriod(next);
      } else if (!next) {
        setPendingPeriod(DEFAULT_CHART_PERIOD);
      }
    };

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", clear);
    router.events.on("routeChangeError", clear);
    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", clear);
      router.events.off("routeChangeError", clear);
    };
  }, [router, pathname]);

  const selectPeriod = (next: ChartPeriod) => {
    if (next === period || next === pendingPeriod) return;
    setPendingPeriod(next);
    const href =
      next === DEFAULT_CHART_PERIOD
        ? pathname
        : `${pathname}?period=${encodeURIComponent(next)}`;
    void router.push(href, undefined, { scroll: false });
  };

  return {
    isPending: pendingPeriod !== null && pendingPeriod !== period,
    displayPeriod: pendingPeriod ?? period,
    selectPeriod,
  };
}
