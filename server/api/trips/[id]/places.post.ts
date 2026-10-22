import type { CreatePlacePayload, Place } from "#shared/types/place";
import { isPlaceCategory } from "#shared/utils/placeCategories";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const trip = await requireUserTrip(user.id, getRouterParam(event, "id"));
  const body = await readBody<Partial<CreatePlacePayload>>(event);
  const name = body?.name?.trim();

  if (!name) {
    throw createError({ statusCode: 400, message: "Название места обязательно" });
  }

  const place: Place = {
    id: crypto.randomUUID(),
    tripId: trip.id,
    ownerId: user.id,
    name,
    category: isPlaceCategory(body.category) ? body.category : null,
    description: body.description?.trim() ?? "",
    img: body.img?.startsWith("data:image/") ? body.img : null,
    createdAt: new Date().toISOString(),
  };

  await addPlace(place);

  setResponseStatus(event, 201);
  return place;
});
