<template>
  <USelectMenu
    v-model="selectedCountry"
    :items="countryData"
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

type CountrySource = {
  code?: string;
  name?: string;
  translations?: {
    ru?: string;
  };
};

const selectedCountry = defineModel<CountryOption | undefined>();

const { data: countries, status } = useFetch<CountrySource[]>("/api/locationSearch", {
  key: "countries",
  lazy: true,
  server: false,
  default: () => [],
});

const countryData = computed<CountryOption[]>(() =>
  countries.value.flatMap(item =>
    item.code
      ? [{ label: item.translations?.ru || item.name || item.code, value: item.code }]
      : [],
  ),
);
</script>
