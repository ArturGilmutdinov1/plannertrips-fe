// Справочник городов лежит в server/assets/cities.json (собирается scripts/build-cities.mjs)
// и попадает только в серверную сборку, в браузер он не уходит.
import type { City } from "#shared/types/city";

interface IndexedCity {
  city: City;
  keys: string[];
}

let index: Promise<IndexedCity[]> | undefined;

function normalize(value: string) {
  return value.trim().toLowerCase().replaceAll("ё", "е");
}

function loadIndex() {
  index ??= useStorage("assets:server")
    .getItem<City[]>("cities.json")
    .then(cities => (cities ?? []).map(city => ({ city, keys: [normalize(city.name), normalize(city.nameEn)] })))
    .catch((error) => {
      index = undefined;
      throw error;
    });
  return index;
}

// Совпадение с началом любого слова: «петер» найдёт «Санкт-Петербург», «йорк» — «Нью-Йорк».
function matches(key: string, query: string) {
  return key.startsWith(query) || key.includes(` ${query}`) || key.includes(`-${query}`);
}

export async function searchCities(options: { query: string; countryCode?: string; limit: number }): Promise<City[]> {
  const query = normalize(options.query);
  const result: City[] = [];

  // Города в файле отсортированы по населению, поэтому первые совпадения — самые крупные.
  for (const { city, keys } of await loadIndex()) {
    if (options.countryCode && city.countryCode !== options.countryCode) continue;
    if (query && !keys.some(key => matches(key, query))) continue;

    result.push(city);
    if (result.length === options.limit) break;
  }

  return result;
}
