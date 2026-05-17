import { defineRouting } from "next-intl/routing";

// [LOCALE] Update this list when adding a new locale
export const routing = defineRouting({
  locales: ["en", "fr", "nl"],
  defaultLocale: "en",
});
