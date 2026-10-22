import type { PlaceCategory } from "#shared/utils/placeCategories";

export interface Place {
  id: string;
  tripId: string;
  ownerId: string;
  name: string;
  category: PlaceCategory | null;
  description: string;
  // Пока нет файлового хранилища, картинка лежит как data URL.
  img: string | null;
  createdAt: string;
}

export interface CreatePlacePayload {
  name: string;
  category: PlaceCategory | null;
  description: string;
  img: string | null;
}
