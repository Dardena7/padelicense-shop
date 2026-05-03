"use client";

import { useEffect } from "react";
import { useLocalization } from "@/lib/localizationContext";

type AlternateUrlsSyncProps = {
  urls: Record<string, string>;
};

export const AlternateUrlsSync = (props: AlternateUrlsSyncProps) => {
  const { urls } = props;
  const { setAlternateUrls } = useLocalization();

  useEffect(() => {
    setAlternateUrls(urls);
    return () => setAlternateUrls({});
  }, [urls, setAlternateUrls]);

  return null;
};
