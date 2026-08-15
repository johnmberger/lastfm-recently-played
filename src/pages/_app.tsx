import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/layout/LoadingScreen";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SPLASH_KEY = "earworms-splash-seen";

function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // "boot" = deciding; only cover the page when we know we should show splash
  const [splash, setSplash] = useState<"boot" | "show" | "done">("boot");

  useEffect(() => {
    let prevPath = window.location.pathname;
    const onComplete = (url: string) => {
      const nextPath = url.split("?")[0];
      // Query-only changes (e.g. duration) keep scroll; page changes jump to top
      if (nextPath !== prevPath) {
        scrollToTop();
      }
      prevPath = nextPath;
    };
    router.events.on("routeChangeComplete", onComplete);
    return () => {
      router.events.off("routeChangeComplete", onComplete);
    };
  }, [router.events]);

  useEffect(() => {
    let cancelled = false;
    try {
      if (sessionStorage.getItem(SPLASH_KEY) === "1") {
        // Stay in "boot" — same UI as "done" (no overlay)
        return;
      }
    } catch {
      // show splash this visit
    }

    // Defer so we don't sync-setState in the effect body (hydration-safe)
    const showTimer = setTimeout(() => {
      if (!cancelled) setSplash("show");
    }, 0);
    const doneTimer = setTimeout(() => {
      if (cancelled) return;
      setSplash("done");
      try {
        sessionStorage.setItem(SPLASH_KEY, "1");
      } catch {
        // ignore
      }
    }, 1800);

    return () => {
      cancelled = true;
      clearTimeout(showTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div className={`${inter.variable} font-sans`}>
      {splash === "show" ? <LoadingScreen isLoading /> : null}
      <Component {...pageProps} />
    </div>
  );
}
