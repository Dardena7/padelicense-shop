import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import fr from "i18n-iso-countries/langs/fr.json";
import nl from "i18n-iso-countries/langs/nl.json";

countries.registerLocale(en);
countries.registerLocale(fr);
countries.registerLocale(nl);

export const getCountryName = (code: string, locale: string): string => {
  return countries.getName(code, locale, { select: "alias" })
    ?? countries.getName(code, locale)
    ?? code;
};
