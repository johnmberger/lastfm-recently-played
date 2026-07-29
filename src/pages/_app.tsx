import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import MetaTags from "@/components/MetaTags";
import LoadingScreen from "@/components/LoadingScreen";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <MetaTags />
      <LoadingScreen isLoading={isLoading} />
      {!isLoading && <Component {...pageProps} />}
    </>
  );
}
