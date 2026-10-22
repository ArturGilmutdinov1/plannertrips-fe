export const PLACE_CATEGORIES = ["sight", "museum", "nature", "food", "stay", "other"] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export const PLACE_CATEGORY_LABELS: Record<PlaceCategory, string> = {
  sight: "Достопримечательность",
  museum: "Музей",
  nature: "Природа",
  food: "Еда",
  stay: "Жильё",
  other: "Другое",
};

export function isPlaceCategory(value: unknown): value is PlaceCategory {
  return PLACE_CATEGORIES.includes(value as PlaceCategory);
}
