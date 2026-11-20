export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const parent = await requireUserTrip(user.id, getRouterParam(event, "id"));
  const childId = getRouterParam(event, "childId");
  if (!childId) {
    throw createError({ statusCode: 400, message: "Маршрут не указан" });
  }

  await detachChildTrip(user.id, parent.id, childId);
  setResponseStatus(event, 204);
});
