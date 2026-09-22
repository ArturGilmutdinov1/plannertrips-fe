<template>
  <USelectMenu
    v-model="selectedCountry"
    :items="countryData"
    name="country"
    icon="i-lucide-globe-2"
    placeholder="Выберите страну"
    searchable
    :loading="isLoading"
    size="lg"
    class="w-full"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

type CountryOption = {
  label: string;
  value: string;
};

type CountrySource = {
  code?: string;
  name?: string;
  translations?: {
    ru?: string;
  };
};

const selectedCountry = defineModel<CountryOption | null>({
  default: null,
});

const countries = ref<CountrySource[]>([]);
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;

  try {
    const { data, error } = await useFetch<CountrySource[]>("/api/locationSearch");

    if (error.value) {
      console.error("Ошибка загрузки:", error.value);
      return;
    }

    if (data.value) {
      countries.value = data.value;
    }
  } catch (err) {
    console.error("Ошибка:", err);
  } finally {
    isLoading.value = false;
  }
});

const countryData = computed<CountryOption[]>(() => {
  if (!countries.value || !Array.isArray(countries.value)) return [];

  return countries.value
    .filter((item) => item?.code)
    .map((item) => ({
      label: item.translations?.ru || item.name || item.code,
      value: item.code,
    }));
});
</script>
