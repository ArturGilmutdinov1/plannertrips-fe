<template>
  <UButton
    icon="i-lucide-plus"
    label="Добавить место"
    variant="soft"
    @click="onSubmit"
  />
</template>

<script setup lang="ts">
function onSubmit() {
  navigateTo({
    path: "/trips/items/1",
  });
}
</script>
