<template>
  <UButton
    icon="i-lucide-plus"
    label="Добавить место"
    variant="soft"
    size="lg"
    :to="`/trips/${tripId}/places/new`"
    class="w-full justify-center sm:w-auto max-sm:[&_.truncate]:hidden"
    aria-label="Добавить место"
  />
</template>

<script setup lang="ts">
defineProps<{ tripId: string }>();
</script>
