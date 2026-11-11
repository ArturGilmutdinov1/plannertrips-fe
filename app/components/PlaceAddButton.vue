<template>
  <UButton
    icon="i-lucide-plus"
    variant="soft"
    :to="`/trips/${tripId}/places/new`"
    aria-label="Добавить место"
  />
</template>

<script setup lang="ts">
defineProps<{ tripId: string }>();
</script>
