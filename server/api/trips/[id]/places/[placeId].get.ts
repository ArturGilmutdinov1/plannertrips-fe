export default defineEventHandler(async (event) => {
  // 1. Достаем значения
  const tripId = getRouterParam(event, "id");
  const placeId = getRouterParam(event, "placeId");

  const result = await requiredPlace(tripId, placeId);

  return result;
});
