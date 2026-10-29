export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const trip = await requireUserTrip(user.id, getRouterParam(event, "id"));

  const places = await getTripPlaces(trip.id);
  return places.toSorted((a, b) => a.createdAt.localeCompare(b.createdAt));
});
