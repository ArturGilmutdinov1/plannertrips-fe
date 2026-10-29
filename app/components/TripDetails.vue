<template>
  <UPage>
    <UPageHeader
      :title="pageTitle"
      :description="pageDescription"
    >
      <template #links>
        <MapForTrip />
        <PlaceAddButton
          v-if="places.length"
          :trip-id="trip.id"
        />
      </template>
    </UPageHeader>

    <UPageBody>
      <div
        v-if="places.length"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <UCard
          v-for="place in places"
          :key="place.id"
        >
          <template
            v-if="place.img"
            #header
          >
            <img
              :src="place.img"
              :alt="place.name"
              class="h-40 w-full rounded-md object-cover"
            >
          </template>

          <div class="space-y-2">
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-semibold text-highlighted">
                {{ place.name }}
              </h3>
              <UBadge
                v-if="place.category"
                :label="PLACE_CATEGORY_LABELS[place.category]"
                variant="subtle"
              />
            </div>
            <p
              v-if="place.description"
              class="text-sm text-muted"
            >
              {{ place.description }}
            </p>
          </div>
        </UCard>
      </div>

      <UCard
        v-else
        class="border-dashed"
      >
        <div
          class="flex flex-col items-center justify-center gap-4 py-12 text-center min-h-[400px]"
        >
          <UAvatar
            icon="i-lucide-map-pinned"
            size="xl"
            class="bg-primary/10 text-primary"
          />

          <div class="space-y-2">
            <h2 class="text-lg font-semibold text-highlighted">
              Маршрут пока пустой
            </h2>
            <p class="max-w-md text-sm text-muted">
              Добавьте первые места поездки
            </p>
          </div>
          <PlaceAddButton :trip-id="trip.id" />
        </div>
      </UCard>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import type { Place } from "#shared/types/place";
import type { Trip } from "#shared/types/trip";
import { PLACE_CATEGORY_LABELS } from "#shared/utils/placeCategories";
import MapForTrip from "./maps/MapForTrip.vue";

const props = defineProps<{ trip: Trip }>();

const { data: places } = await useFetch<Place[]>(() => `/api/trips/${props.trip.id}/places`, {
  default: () => [],
});

const pageTitle = computed(() => props.trip.name || "Новый маршрут");
const pageDescription = computed(() =>
  props.trip.country?.label
    ? `План поездки: ${props.trip.country.label}`
    : "Начните собирать маршрут по дням и местам",
);
</script>
