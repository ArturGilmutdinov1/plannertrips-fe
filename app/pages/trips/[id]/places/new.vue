<template>
  <PlaceForm :trip-id="tripId" />
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const route = useRoute();
const tripId = String(route.params.id);
</script>
