import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

const SPLASH_KEY = "earworms-splash-seen";

export default function App({ Component, pageProps }: AppProps) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    let cancelled = false;

    try {
      if (sessionStorage.getItem(SPLASH_KEY) === "1") return;
    } catch {
      // continue — show splash this visit
    }

    setShowSplash(true);
    const timer = setTimeout(() => {
      if (cancelled) return;
      setShowSplash(false);
      try {
        sessionStorage.setItem(SPLASH_KEY, "1");
      } catch {
        // ignore
      }
    }, 1800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {showSplash ? <LoadingScreen isLoading={showSplash} /> : null}
      <Component {...pageProps} />
    </>
  );
}
