// Мок-хранилище поездок, пока нет бэкенда.
// Nitro-маунт "data" в dev пишет в .data/kv, поэтому данные переживают перезапуск.
import type { Place } from "#shared/types/place";

const KEY = "mock:trips";

const seed: Place[] = [
  {
    id: 1,
    trip_id: 1,
    name: "Что-Нибудь",
    description: "еще что нибудь",
  },
].map((place) => ({
  ...place,
  ownerId: DEMO_USER_ID,
  createdAt: new Date(0).toISOString(),
}));

async function getAllPlaces(): Promise<Place[]> {
  const storage = useStorage("data");
  const places = await storage.getItem<Place[]>(KEY);
  if (!places) {
    await storage.setItem(KEY, seed);
    return seed;
  }

  // Поездки, созданные до появления авторизации, отдаём демо-пользователю.
  return places.map((place) => ({
    ...place,
    ownerId: place.ownerId ?? DEMO_USER_ID,
  }));
}

export async function getTripPlaces(trip_id: string): Promise<Place[]> {
  return (await getAllPlaces()).filter((place) => place.trip_id === trip_id);
}

export async function addPlace(place: Place) {
  const places = await getAllPlaces();
  await useStorage("data").setItem(KEY, [...places, place]);
}
