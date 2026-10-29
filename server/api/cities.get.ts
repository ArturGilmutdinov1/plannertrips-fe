const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

// GET /api/cities?q=рим&country=IT&limit=20
export default defineEventHandler(async (event) => {
  const { q, country, limit } = getQuery(event);
  const query = typeof q === "string" ? q : "";
  const countryCode = typeof country === "string" && country ? country.toUpperCase() : undefined;

  if (!countryCode && query.trim().length < 2) {
    throw createError({ statusCode: 400, message: "Укажите страну или минимум 2 символа для поиска" });
  }

  return searchCities({
    query,
    countryCode,
    limit: Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT),
  });
});
