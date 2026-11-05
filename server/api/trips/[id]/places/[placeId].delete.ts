export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const tripId = getRouterParam(event, "id");
  const placeId = getRouterParam(event, "placeId");

  if (!tripId || !placeId) {
    throw createError({
      statusCode: 400,
      message: "Некорректные параметры запроса",
    });
  }

  return await removePlace(tripId, placeId);
});
