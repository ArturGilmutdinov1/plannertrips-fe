<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6">
    <UCard class="overflow-hidden">
      <!-- Блок с картинкой (если она есть) -->
      <template v-if="place.img" #header>
        <img
          :src="place.img"
          :alt="place.name"
          class="h-64 sm:h-96 w-full object-cover"
        />
      </template>

      <!-- Основной контент -->
      <div class="space-y-6 p-2 sm:p-4">
        <!-- Заголовок и категория (если есть) -->
        <div class="flex items-start justify-between gap-4">
          <h1
            class="text-2xl sm:text-4xl font-bold text-highlighted leading-tight break-words"
          >
            {{ place.name }}
          </h1>

          <UBadge
            v-if="place.category"
            :label="place.category"
            variant="subtle"
            size="lg"
            class="shrink-0"
          />
        </div>

        <!-- Описание -->
        <p
          class="text-base sm:text-lg text-muted leading-relaxed whitespace-pre-line break-words"
        >
          {{ place.description || "Описание пока нет." }}
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Place } from "#shared/types/place";

const route = useRoute();
const tripId = computed(() => route.params.id);
const placeId = computed(() => route.params.placeId);

const { data: place, error } = await useFetch<Place>(
  () => `/api/trips/${tripId.value}/places/${placeId.value}`,
);

console.log("place.value", place.value);
</script>
