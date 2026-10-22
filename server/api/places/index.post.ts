import type { CreatePlacePayload, Place } from "#shared/types/place";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const body = await readBody<Partial<CreatePlacePayload>>(event);
  const name = body?.name?.trim();

  if (!name) {
    throw createError({
      statusCode: 400,
      message: "Название локации обязательно",
    });
  }

  const place: Place = {
    id: crypto.randomUUID(),
    ownerId: user.id,
    name,
    description: "",
  };

  await addPlace(place);

  setResponseStatus(event, 201);
  return place;
});
