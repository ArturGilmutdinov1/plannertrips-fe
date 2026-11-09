export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const tripId = getRouterParam(event, "id");

  if (!tripId) {
    throw createError({
      statusCode: 400,
      message: "Некорректные параметры запроса",
    });
  }

  await requireUserTrip(user.id, tripId);
  return await removeTrip(tripId);
});
