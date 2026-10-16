import type { CreateTripPayload, Trip } from "#shared/types/trip";

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CreateTripPayload>>(event);
  const name = body?.name?.trim();

  if (!name) {
    throw createError({ statusCode: 400, message: "Название поездки обязательно" });
  }

  const trip: Trip = {
    id: crypto.randomUUID(),
    name,
    description: "",
    country: body.country ?? null,
    createdAt: new Date().toISOString(),
  };

  const trips = await getTrips();
  await saveTrips([...trips, trip]);

  setResponseStatus(event, 201);
  return trip;
});
