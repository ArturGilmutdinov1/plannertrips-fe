export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const trip = await requireUserTrip(user.id, getRouterParam(event, "id"));

  return requirePlace(trip.id, getRouterParam(event, "placeId"));
});
