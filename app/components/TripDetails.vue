<template>
  <UPage>
    <UPageHeader
      :title="pageTitle"
      :description="pageDescription"
    />

    <UPageBody>
      <UCard class="border-dashed">
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
          <AddTripDetailCard />
        </div>
      </UCard>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import type { Trip } from "#shared/types/trip";

const props = defineProps<{ trip: Trip }>();

const pageTitle = computed(() => props.trip.name || "Новый маршрут");
const pageDescription = computed(() =>
  props.trip.country?.label
    ? `План поездки: ${props.trip.country.label}`
    : "Начните собирать маршрут по дням и местам",
);
</script>
