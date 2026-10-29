<template></template>

<script setup lang="ts">
import type { Place } from "#shared/types/place";
import type { Trip } from "#shared/types/trip";

const route = useRoute();
const tripId = computed(() => route.params.id);
const placeId = computed(() => route.params.placeId);

console.log(`/api/trips/${tripId.value}}/places/${placeId.value}`);

const { data: place, error } = await useFetch<Place>(
  () => `/api/trips/${tripId.value}/places/${placeId.value}`,
);

console.log("place.value:", place.value);
console.log("error.value:", error.value);
</script>
