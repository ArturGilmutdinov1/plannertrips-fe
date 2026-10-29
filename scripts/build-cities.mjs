// Собирает server/assets/cities.json из дампов GeoNames (https://www.geonames.org, лицензия CC BY 4.0).
// Запускать вручную, когда нужно обновить справочник; результат коммитится в репозиторий.
//
//   curl -O https://download.geonames.org/export/dump/cities15000.zip && unzip cities15000.zip
//   curl -O https://download.geonames.org/export/dump/alternateNamesV2.zip
//   unzip -p alternateNamesV2.zip alternateNamesV2.txt | awk -F'\t' '$3 == "ru"' > alternateNames.ru.txt
//   node scripts/build-cities.mjs cities15000.txt alternateNames.ru.txt
//
// Второй файл может быть и полным alternateNamesV2.txt — лишние языки отфильтруются, просто дольше.
import { createReadStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import { createInterface } from "node:readline";

const OUTPUT = new URL("../server/assets/cities.json", import.meta.url);

// PPLX — районы внутри городов, PPLH/PPLQ/PPLW — исторические, заброшенные и разрушенные.
const EXCLUDED_FEATURE_CODES = new Set(["PPLX", "PPLH", "PPLQ", "PPLW"]);

const [citiesPath, alternateNamesPath] = process.argv.slice(2);
if (!citiesPath || !alternateNamesPath) {
  console.error("Usage: node scripts/build-cities.mjs <cities15000.txt> <alternateNames.ru.txt>");
  process.exit(1);
}

async function* readTsv(path) {
  const lines = createInterface({ input: createReadStream(path, "utf8"), crlfDelay: Infinity });
  for await (const line of lines) {
    if (line) yield line.split("\t");
  }
}

// cities15000.txt: geonameid, name, asciiname, alternatenames, latitude, longitude,
// feature class, feature code, country code, cc2, admin1-4, population, ...
const cities = new Map();
for await (const row of readTsv(citiesPath)) {
  if (EXCLUDED_FEATURE_CODES.has(row[7])) continue;

  cities.set(row[0], {
    id: Number(row[0]),
    name: row[1],
    nameEn: row[1],
    countryCode: row[8],
    lat: Math.round(Number(row[4]) * 1e4) / 1e4,
    lng: Math.round(Number(row[5]) * 1e4) / 1e4,
    population: Number(row[14]),
  });
}

// alternateNamesV2.txt: alternateNameId, geonameid, isolanguage, name,
// isPreferredName, isShortName, isColloquial, isHistoric, from, to
const ruNames = new Map();
for await (const row of readTsv(alternateNamesPath)) {
  if (row[2] !== "ru" || !cities.has(row[1]) || row[6] === "1" || row[7] === "1") continue;

  // Предпочтительное название важнее короткого, при равенстве оставляем первое.
  const score = (row[4] === "1" ? 2 : 0) + (row[5] === "1" ? 0 : 1);
  const current = ruNames.get(row[1]);
  if (!current || score > current.score) {
    ruNames.set(row[1], { name: row[3], score });
  }
}

const result = [...cities.entries()]
  .map(([id, city]) => ({ ...city, name: ruNames.get(id)?.name ?? city.name }))
  .sort((a, b) => b.population - a.population);

await writeFile(OUTPUT, `[\n${result.map(city => JSON.stringify(city)).join(",\n")}\n]\n`);

console.log(`Готово: ${result.length} городов, с русским названием — ${ruNames.size}.`);
