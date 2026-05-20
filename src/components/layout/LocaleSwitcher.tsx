"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocalizationContext } from "@/lib/localization";

// [LOCALE] Update this mapping when adding a new locale
const localeLabels: Record<(typeof routing.locales)[number], string> = {
  en: "EN",
  fr: "FR",
  nl: "NL",
};

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { alternateUrls } = useLocalizationContext();

  const handleChange = (newLocale: string) => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const basePath = alternateUrls[newLocale] || pathname;
    router.replace(`${basePath}${search}`, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          className={`
            text-xs px-2 py-1 rounded transition-colors cursor-pointer
            ${loc === locale ? "bg-foreground text-background font-medium" : "text-muted hover:text-foreground"}
          `}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
};
