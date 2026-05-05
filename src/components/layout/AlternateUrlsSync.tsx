"use client";

import { useEffect } from "react";
import { useLocalizationContext } from "@/lib/localization";

type AlternateUrlsSyncProps = {
  urls: Record<string, string>;
};

export const AlternateUrlsSync = (props: AlternateUrlsSyncProps) => {
  const { urls } = props;
  const { setAlternateUrls } = useLocalizationContext();

  useEffect(() => {
    setAlternateUrls(urls);
    return () => setAlternateUrls({});
  }, [urls, setAlternateUrls]);

  return null;
};
