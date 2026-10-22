import CountriesData from "@innovayse/geo-atlas/lite";
import type { CountryOption } from "#shared/types/trip";

// Справочник статичный: собираем его один раз при старте, а не на каждый запрос.
const countries: CountryOption[] = CountriesData.getCountries()
  .flatMap((country) => {
    const code = country.iso2 ?? country.code;
    return code ? [{ label: country.translations?.ru || country.name || code, value: code }] : [];
  })
  .sort((a, b) => a.label.localeCompare(b.label, "ru"));

export default defineEventHandler(() => countries);
