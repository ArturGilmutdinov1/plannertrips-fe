// Мок-хранилище поездок, пока нет бэкенда.
// Nitro-маунт "data" в dev пишет в .data/kv, поэтому данные переживают перезапуск.
import type { Trip } from "#shared/types/trip";

const KEY = "mock:trips";

const seed: Trip[] = [
  { id: "1", name: "Рим на 3 дня", description: "Колизей, Ватикан", country: { label: "Италия", value: "IT" } },
  { id: "2", name: "Алтай", description: "Треккинг, 5 дней", country: { label: "Россия", value: "RU" } },
  { id: "3", name: "Питер", description: "Эрмитаж, Петергоф", country: { label: "Россия", value: "RU" } },
  { id: "4", name: "Карелия", description: "Рускеала, Ладога", country: { label: "Россия", value: "RU" } },
  { id: "5", name: "Байкал", description: "Лёд, Ольхон", country: { label: "Россия", value: "RU" } },
].map(trip => ({ ...trip, createdAt: new Date(0).toISOString() }));

export async function getTrips(): Promise<Trip[]> {
  const storage = useStorage("data");
  const trips = await storage.getItem<Trip[]>(KEY);
  if (trips) return trips;

  await storage.setItem(KEY, seed);
  return seed;
}

export async function saveTrips(trips: Trip[]) {
  await useStorage("data").setItem(KEY, trips);
}
