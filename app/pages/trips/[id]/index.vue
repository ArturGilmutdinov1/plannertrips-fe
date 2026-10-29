<template>
  <TripDetails v-if="trip" :trip="trip" />
</template>

<script setup lang="ts">
import type { Trip } from "#shared/types/trip";

definePageMeta({ middleware: "auth" });

const route = useRoute();

const { data: trip, error } = await useFetch<Trip>(
  () => `/api/trips/${route.params.id}`,
);

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    message:
      (error.value.data as { message?: string } | undefined)?.message ??
      error.value.message,
    fatal: true,
  });
}
</script>
