"use client";

import { createContext, useContext, useState, useCallback } from "react";

type AlternateUrls = Record<string, string>;

type LocalizationContextType = {
  alternateUrls: AlternateUrls;
  setAlternateUrls: (urls: AlternateUrls) => void;
};

const LocalizationContext = createContext<LocalizationContextType>({
  alternateUrls: {},
  setAlternateUrls: () => {},
});

export const LocalizationProvider = (props: {
  children: React.ReactNode;
}) => {
  const { children } = props;
  const [alternateUrls, setAlternateUrlsState] = useState<AlternateUrls>({});

  const setAlternateUrls = useCallback((urls: AlternateUrls) => {
    setAlternateUrlsState(urls);
  }, []);

  return (
    <LocalizationContext.Provider value={{ alternateUrls, setAlternateUrls }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalizationContext = () => useContext(LocalizationContext);
