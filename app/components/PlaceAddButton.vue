<template>
  <UButton
    icon="i-lucide-plus"
    label="Добавить место"
    variant="soft"
    :to="`/trips/${tripId}/places/new`"
    class="w-full justify-center sm:w-auto"
  />
</template>

<script setup lang="ts">
defineProps<{ tripId: string }>();
</script>
