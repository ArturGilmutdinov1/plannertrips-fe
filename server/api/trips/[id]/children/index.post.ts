import type { AddChildTripPayload, Trip } from "#shared/types/trip";

export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const parent = await requireUserTrip(user.id, getRouterParam(event, "id"));
  const body = await readBody<Partial<AddChildTripPayload>>(event);

  if ("childTripId" in body && body.childTripId) {
    await attachChildTrip(user.id, parent.id, body.childTripId);
    return requireUserTrip(user.id, body.childTripId);
  }

  const name = "name" in body ? body.name?.trim() : undefined;
  if (!name) {
    throw createError({ statusCode: 400, message: "Название маршрута обязательно" });
  }

  const trip: Trip = {
    id: crypto.randomUUID(),
    ownerId: user.id,
    name,
    description: "",
    country: "country" in body ? body.country ?? null : null,
    childTripIds: [],
    createdAt: new Date().toISOString(),
  };

  await addTrip(trip);
  await attachChildTrip(user.id, parent.id, trip.id);

  setResponseStatus(event, 201);
  return trip;
});
