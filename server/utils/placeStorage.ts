// Мок-хранилище мест поездок, пока нет бэкенда.
// Nitro-маунт "data" в dev пишет в .data/kv, поэтому данные переживают перезапуск.
import type { Place, UpdatePlacePayload } from "#shared/types/place";

const KEY = "mock:places";

const seed: Place[] = [
  {
    id: "1",
    tripId: "1",
    name: "Колизей",
    category: "sight" as const,
    description: "Лучше прийти к открытию",
  },
].map((place) => ({
  ...place,
  ownerId: DEMO_USER_ID,
  img: null,
  createdAt: new Date(0).toISOString(),
}));

async function getAllPlaces(): Promise<Place[]> {
  const storage = useStorage("data");
  const places = await storage.getItem<Place[]>(KEY);
  if (!places) {
    await storage.setItem(KEY, seed);
    return seed;
  }
  return places;
}

export async function getTripPlaces(tripId: string): Promise<Place[]> {
  return (await getAllPlaces()).filter((place) => place.tripId === tripId);
}

export async function requirePlace(
  tripId: string,
  placeId: string | undefined,
): Promise<Place> {
  const place = (await getTripPlaces(tripId)).find(
    (item) => item.id === placeId,
  );
  if (!place) {
    throw createError({ statusCode: 404, message: "Локация не найдена" });
  }
  return place;
}

export async function addPlace(place: Place) {
  const places = await getAllPlaces();
  await useStorage("data").setItem(KEY, [...places, place]);
}

export async function removePlace(
  tripId: string,
  placeId: string,
): Promise<void> {
  const places = await getAllPlaces();
  const exists = places.some(
    (place) => place.id === placeId && place.tripId === tripId,
  );
  if (!exists) {
    throw createError({ statusCode: 404, message: "Локация не найдена" });
  }
  const filtered = places.filter(
    (place) => !(place.id === placeId && place.tripId === tripId),
  );
  await useStorage("data").setItem(KEY, filtered);
}

export async function updatePlace(
  tripId: string,
  placeId: string,
  placeData: UpdatePlacePayload,
) {
  const places = await getAllPlaces();
  const nextStatePlaces = places.map((place) => {
    if (place.id === placeId && place.tripId === tripId) {
      return {
        ...place,
        name: placeData.name,
        category: placeData.category,
        description: placeData.description,
        img: placeData.img,
      };
    }
    return place;
  });
  await useStorage("data").setItem(KEY, nextStatePlaces); // ← добавить запись
  return nextStatePlaces.find((place) => place.id === placeId && place.tripId === tripId);
}
