"use client";

import { useState } from "react";
import clsx from "clsx";

const LOCALES = ["EN", "FR", "NL"] as const;

type LanguageTabsProps = {
  children: (locale: string) => React.ReactNode;
};

export const LanguageTabs = (props: LanguageTabsProps) => {
  const { children } = props;
  const [activeLocale, setActiveLocale] = useState<string>("EN");

  return (
    <div>
      <div className="flex gap-1 border-b border-gray-200 mb-4">
        {LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => setActiveLocale(locale)}
            className={clsx(
              "px-3 py-2 text-sm font-medium border-b-2 -mb-px",
              activeLocale === locale
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            {locale}
          </button>
        ))}
      </div>
      {children(activeLocale)}
    </div>
  );
};
