<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">
      Мои маршруты
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Первая карточка — добавить -->
      <TripCreateModal />

      <!-- Остальные -->
      <NuxtLink
        v-for="trip in trips"
        :key="trip.id"
        :to="`/trips/${trip.id}`"
      >
        <UCard class="h-full hover:ring-2 hover:ring-primary/50 transition">
          <h3 class="text-sm font-semibold">
            {{ trip.name }}
          </h3>
          <p class="text-xs text-muted">
            {{ trip.description || trip.country?.label }}
          </p>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Trip } from "#shared/types/trip";

const { data: trips } = await useFetch<Trip[]>("/api/trips", {
  key: "trips",
  default: () => [],
});
</script>
