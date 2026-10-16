import CountriesData from "@innovayse/geo-atlas/lite";

export default defineEventHandler(() => {
  return CountriesData.getCountries();
});
