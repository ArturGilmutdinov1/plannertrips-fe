export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const trip = (await getTrips()).find(item => item.id === id);

  if (!trip) {
    throw createError({ statusCode: 404, message: "Поездка не найдена" });
  }

  return trip;
});
