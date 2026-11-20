<template>
  <PlaceForm :trip-id="tripId" mode="create" />
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const route = useRoute();
const tripId = String(route.params.id);
</script>
