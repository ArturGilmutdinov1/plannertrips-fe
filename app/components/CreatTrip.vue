<template>
  <div class="py-8">
    <UPageHeader :title="pageTitle" :description="pageDescription" />

    <UPageBody>
      <UCard class="border-dashed">
        <div class="flex flex-col items-center gap-4 py-12 text-center">
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
              Добавьте первые места поездки, а позже здесь появятся дни, точки
              маршрута и карта.
            </p>
          </div>

          <UButton icon="i-lucide-plus" label="Добавить место" variant="soft" />
        </div>
      </UCard>
    </UPageBody>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

const tripModalStore = useTripModalStore();

const { name, country } = storeToRefs(tripModalStore);

const pageTitle = computed(() => name.value || "Новый маршрут");
const pageDescription = computed(() =>
  country.value?.label
    ? `План поездки: ${country.value.label}`
    : "Начните собирать маршрут по дням и местам",
);
</script>
