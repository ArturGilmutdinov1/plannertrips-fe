export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  return requireUserTrip(user.id, getRouterParam(event, "id"));
});
