<template>
  <div class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Популярные направления</h2>
    <UButton
      to="/destinations"
      variant="link"
      trailing-icon="i-heroicons-arrow-right-20-solid"
      label="Показать все"
    />
    <UCarousel
      v-slot="{ item }"
      :items="items"
      :ui="{ item: 'basis-full sm:basis-1/2 lg:basis-1/3' }"
      arrows
      dots
      class="w-full"
    >
      <div class="p-4">
        <UCard class="h-full">
          <div class="flex flex-col gap-2">
            <UAvatar
              :icon="item.icon"
              size="lg"
              class="bg-primary/10 text-primary"
            />
            <h3 class="text-base font-semibold text-highlighted">
              {{ item.title }}
            </h3>
            <p class="text-sm text-muted">
              {{ item.description }}
            </p>
          </div>
        </UCard>
      </div>
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
const items = [
  {
    id: 1,
    icon: "i-lucide-map-pinned",
    title: "Россия",
    description: "Старый город, серные бани",
  },
  {
    id: 2,
    icon: "i-lucide-mountain",
    title: "Япония",
    description: "Горы, Гергети и дорога ",
  },
  {
    id: 3,
    icon: "i-lucide-waves",
    title: "Германия",
    description: "Море, набережная и башня с часами.",
  },
  {
    id: 4,
    icon: "i-lucide-grape",
    title: "Грузия",
    description: "Винодельни",
  },
  {
    id: 5,
    icon: "i-lucide-landmark",
    title: "Франция",
    description: "Древняя столица",
  },
  {
    id: 6,
    icon: "i-lucide-landmark",
    title: "США",
    description: "Древняя столица, ",
  },
];
</script>
