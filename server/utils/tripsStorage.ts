// Мок-хранилище поездок, пока нет бэкенда.
// Nitro-маунт "data" в dev пишет в .data/kv, поэтому данные переживают перезапуск.
import type { Trip } from "#shared/types/trip";

const KEY = "mock:trips";

const seed: Trip[] = [
  {
    id: "1",
    name: "Рим на 3 дня",
    description: "Колизей, Ватикан",
    country: { label: "Италия", value: "IT" },
  },
  {
    id: "2",
    name: "Алтай",
    description: "Треккинг, 5 дней",
    country: { label: "Россия", value: "RU" },
  },
  {
    id: "3",
    name: "Питер",
    description: "Эрмитаж, Петергоф",
    country: { label: "Россия", value: "RU" },
  },
  {
    id: "4",
    name: "Карелия",
    description: "Рускеала, Ладога",
    country: { label: "Россия", value: "RU" },
  },
  {
    id: "5",
    name: "Байкал",
    description: "Лёд, Ольхон",
    country: { label: "Россия", value: "RU" },
  },
].map((trip) => ({
  ...trip,
  ownerId: DEMO_USER_ID,
  childTripIds: [],
  createdAt: new Date(0).toISOString(),
}));

async function getAllTrips(): Promise<Trip[]> {
  const storage = useStorage("data");
  const trips = await storage.getItem<Trip[]>(KEY);
  if (!trips) {
    await storage.setItem(KEY, seed);
    return seed;
  }

  // Поездки, созданные до появления авторизации, отдаём демо-пользователю.
  return trips.map((trip) => ({
    ...trip,
    ownerId: trip.ownerId ?? DEMO_USER_ID,
    childTripIds: trip.childTripIds ?? [],
  }));
}

export async function getUserTrips(userId: string): Promise<Trip[]> {
  return (await getAllTrips()).filter((trip) => trip.ownerId === userId);
}

export async function requireUserTrip(
  userId: string,
  tripId: string | undefined,
): Promise<Trip> {
  const trip = (await getUserTrips(userId)).find((item) => item.id === tripId);
  if (!trip) {
    throw createError({ statusCode: 404, message: "Поездка не найдена" });
  }
  return trip;
}

export async function addTrip(trip: Trip) {
  const trips = await getAllTrips();
  await useStorage("data").setItem(KEY, [...trips, trip]);
}

export async function getChildTrips(
  userId: string,
  parentTripId: string,
): Promise<Trip[]> {
  const trips = await getUserTrips(userId);
  const parent = trips.find((trip) => trip.id === parentTripId);
  if (!parent) return [];

  const byId = new Map(trips.map((trip) => [trip.id, trip]));
  return parent.childTripIds.flatMap((id) => {
    const trip = byId.get(id);
    return trip ? [trip] : [];
  });
}

function reachesTrip(
  tripsById: Map<string, Trip>,
  startTripId: string,
  targetTripId: string,
): boolean {
  const visited = new Set<string>();
  const pending = [startTripId];

  while (pending.length) {
    const currentId = pending.pop()!;
    if (currentId === targetTripId) return true;
    if (visited.has(currentId)) continue;
    visited.add(currentId);
    pending.push(...(tripsById.get(currentId)?.childTripIds ?? []));
  }

  return false;
}

export async function attachChildTrip(
  userId: string,
  parentTripId: string,
  childTripId: string,
): Promise<void> {
  const trips = await getAllTrips();
  const parent = trips.find(
    (trip) => trip.id === parentTripId && trip.ownerId === userId,
  );
  const child = trips.find(
    (trip) => trip.id === childTripId && trip.ownerId === userId,
  );

  if (!parent || !child) {
    throw createError({ statusCode: 404, message: "Маршрут не найден" });
  }
  if (parent.id === child.id) {
    throw createError({
      statusCode: 400,
      message: "Нельзя вложить маршрут в самого себя",
    });
  }
  if (parent.childTripIds.includes(child.id)) return;

  const tripsById = new Map(trips.map((trip) => [trip.id, trip]));
  if (reachesTrip(tripsById, child.id, parent.id)) {
    throw createError({
      statusCode: 400,
      message: "Связь создаёт цикл маршрутов",
    });
  }

  const updated = trips.map((trip) =>
    trip.id === parent.id
      ? { ...trip, childTripIds: [...trip.childTripIds, child.id] }
      : trip,
  );
  await useStorage("data").setItem(KEY, updated);
}

export async function detachChildTrip(
  userId: string,
  parentTripId: string,
  childTripId: string,
): Promise<void> {
  const trips = await getAllTrips();
  const parent = trips.find(
    (trip) => trip.id === parentTripId && trip.ownerId === userId,
  );
  if (!parent) {
    throw createError({ statusCode: 404, message: "Маршрут не найден" });
  }

  const updated = trips.map((trip) =>
    trip.id === parent.id
      ? {
          ...trip,
          childTripIds: trip.childTripIds.filter((id) => id !== childTripId),
        }
      : trip,
  );
  await useStorage("data").setItem(KEY, updated);
}

export async function removeTrip(tripId: string): Promise<void> {
  const trips = await getAllTrips();
  const exists = trips.some((trip) => trip.id === tripId);
  if (!exists) {
    throw createError({ statusCode: 404, message: "Маршрут не найден" });
  }
  const filtered = trips
    .filter((trip) => trip.id !== tripId)
    .map((trip) => ({
      ...trip,
      childTripIds: trip.childTripIds.filter((id) => id !== tripId),
    }));
  await useStorage("data").setItem(KEY, filtered);
}
