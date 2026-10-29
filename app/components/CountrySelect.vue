<template>
  <USelectMenu
    v-model="selectedCountry"
    :items="countries"
    name="country"
    icon="i-lucide-globe-2"
    placeholder="Выберите страну"
    :loading="status === 'pending'"
    size="lg"
    class="w-full"
  />
</template>

<script setup lang="ts">
import type { CountryOption } from "#shared/types/trip";

const selectedCountry = defineModel<CountryOption | undefined>();

const { data: countries, status } = useFetch<CountryOption[]>("/api/countries", {
  key: "countries",
  lazy: true,
  server: false,
  default: () => [],
});
</script>
