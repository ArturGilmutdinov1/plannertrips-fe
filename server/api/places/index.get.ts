export default defineEventHandler(async (event) => {
  const user = await requireUser(event);

  const tripId = getRouterParam(event, "tripId");
  if (!tripId) {
    throw createError({ statusCode: 400, statusMessage: "tripId is required" });
  }

  const places = await getTripPlaces(tripId);
  return places.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
});
