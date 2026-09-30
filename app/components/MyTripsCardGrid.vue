<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">Мои маршруты</h2>
    <UButton
      to="/destinations"
      variant="link"
      trailing-icon="i-heroicons-arrow-right-20-solid"
      label="Показать все"
    />
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Первая карточка — добавить -->
      <ModalCreateTrip />

      <!-- Остальные -->
      <UCard
        v-for="route in visibleRoutes"
        :key="route.id"
        class="cursor-pointer"
      >
        <h3 class="text-sm font-semibold">{{ route.title }}</h3>
        <p class="text-xs text-muted">{{ route.description }}</p>
      </UCard>
    </div>

    <div v-if="routes.length > 4" class="flex justify-center mt-6">
      <!-- <UButton> Показать все </UButton> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const routes = [
  { id: "1", title: "Рим на 3 дня", description: "Колизей, Ватикан" },
  { id: "2", title: "Алтай", description: "Треккинг, 5 дней" },
  { id: "3", title: "Питер", description: "Эрмитаж, Петергоф" },
  { id: "4", title: "Карелия", description: "Рускеала, Ладога" },
  { id: "5", title: "Байкал", description: "Лёд, Ольхон" },
];

const isExpanded = ref(false);

const visibleRoutes = computed(() => routes);
</script>
