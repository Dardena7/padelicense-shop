"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import fr from "i18n-iso-countries/langs/fr.json";
import nl from "i18n-iso-countries/langs/nl.json";
import { Select } from "../Select/Select";

countries.registerLocale(en);
countries.registerLocale(fr);
countries.registerLocale(nl);

type CountrySelectProps = {
  label?: string;
  value: string;
  onChange: (countryIso: string) => void;
  error?: string;
  required?: boolean;
  id?: string;
};

export const CountrySelect = (props: CountrySelectProps) => {
  const { label, value, onChange, error, required, id } = props;
  const locale = useLocale();

  const options = useMemo(() => {
    const names = countries.getNames(locale);
    return Object.entries(names)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);

  return (
    <Select
      id={id}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      required={required}
    >
      <option value="">{""}</option>
      {options.map((option) => (
        <option key={option.code} value={option.code}>
          {option.name}
        </option>
      ))}
    </Select>
  );
};

export const getCountryName = (code: string, locale: string): string => {
  return countries.getName(code, locale, { select: "alias" })
    ?? countries.getName(code, locale)
    ?? code;
};
