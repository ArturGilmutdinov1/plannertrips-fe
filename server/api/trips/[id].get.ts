export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const id = getRouterParam(event, "id");
  const trip = (await getUserTrips(user.id)).find(item => item.id === id);

  if (!trip) {
    throw createError({ statusCode: 404, message: "Поездка не найдена" });
  }

  return trip;
});
