import { UpdatePlacePayload } from "~~/shared/types/place";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const placeData = await readBody<UpdatePlacePayload>(event);
  const tripId = getRouterParam(event, "id");
  const placeId = getRouterParam(event, "placeId");

  await requireUserTrip(user.id, tripId);

  if (!tripId || !placeId) {
    throw createError({
      statusCode: 400,
      message: "Некорректные параметры запроса",
    });
  }
  if (!placeData.name?.trim()) {
    throw createError({ statusCode: 400, message: "Поле name обязательно" });
  }

  const updateDate = await updatePlace(tripId, placeId, {
    name: placeData.name,
    category: placeData.category,
    description: placeData.description,
    img: placeData.img,
  });

  if (!updateDate) {
    throw createError({ statusCode: 404, message: "Поездка не найдена" });
  }
  return;
});
