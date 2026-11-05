export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const tripId = getRouterParam(event, "id");

  if (!tripId) {
    throw createError({
      statusCode: 400,
      message: "Некорректные параметры запроса",
    });
  }

  return await removeTrip(tripId);
});
