export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const parent = await requireUserTrip(user.id, getRouterParam(event, "id"));
  return getChildTrips(user.id, parent.id);
});
