<template>
  <USelectMenu
    v-model="selectedCountry"
    :items="countryData"
    name="country"
    class="w-48"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const selectedCountry = ref<string>("");
const countries = ref<any[]>([]);
onMounted(async () => {
  try {
    const { data, error } = await useFetch("/api/locationSearch");

    if (error.value) {
      console.error("Ошибка загрузки:", error.value);
      return;
    }

    if (data.value) {
      countries.value = data.value;
    }
  } catch (err) {
    console.error("Ошибка:", err);
  }
});

const countryData = computed(() => {
  if (!countries.value || !Array.isArray(countries.value)) return [];

  return countries.value
    .filter((item: any) => item?.code)
    .map((item: any) => ({
      label: item.translations?.ru || item.name || item.code,
      value: item.code,
    }));
});
</script>
