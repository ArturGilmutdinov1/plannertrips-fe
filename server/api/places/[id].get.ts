export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const id = getRouterParam(event, "id");
  const place = (await getUserTrips(user.id)).find((item) => item.id === id);

  if (!place) {
    throw createError({ statusCode: 404, message: "Поездка не найдена" });
  }

  return place;
});
