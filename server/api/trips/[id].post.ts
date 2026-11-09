import type { UpdateTripPoyload, Trip } from "#shared/types/trip";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const tripData = await readBody<Partial<UpdateTripPoyload>>(event);
  const tripId = getRouterParam(event, "id");

  await requireUserTrip(user.id, tripId);

  if (!tripId) {
    throw createError({
      statusCode: 400,
      message: "Некорректные параметры запроса",
    });
  }
  if (!tripData.name?.trim()) {
    throw createError({ statusCode: 400, message: "Поле name обязательно" });
  }
  if (!tripData.country) {
    throw createError({ statusCode: 400, message: "Поле country обязательно" });
  }

  const updateDate = await updateTrip(tripId, {
    name: tripData.name!.trim(),
    country: tripData.country!,
  });

  if (!updateDate) {
    throw createError({ statusCode: 404, message: "Поездка не найдена" });
  }
  return { name: updateDate.name, country: updateDate.country };
});
