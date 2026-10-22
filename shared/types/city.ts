export interface City {
  // geonameid из GeoNames
  id: number;
  // Русское название, если есть перевод, иначе международное.
  name: string;
  nameEn: string;
  // ISO 3166-1 alpha-2, как value в CountryOption
  countryCode: string;
  lat: number;
  lng: number;
  population: number;
}
