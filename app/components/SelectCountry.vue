<template>
  <UForm :state="state" @submit="onSubmit">
    <div>
      Название путешествия
      <UInput v-model="modalStore.name" />
    </div>
    <div>
      Страна
      <USelectMenu
        v-model="modalStore.country"
        :items="countryData"
        name="country"
        class="w-48"
      />
    </div>
    <UButton type="submit">Создать</UButton>
  </UForm>
</template>

<script setup lang="ts">
import { useTripModalStore } from "../stores/tripModalStore";
import { navigateTo } from "nuxt/app";

const modalStore = useTripModalStore();

//Загрузка стран в лукап
const { data } = await useFetch("/api/locationSearch");
const countryData = computed(() => {
  if (!data.value) return [];
  return data.value.map((item) => {
    return {
      label: item.translations?.ru,
      value: item.code,
    };
  });
});
const items = countryData;

function onSubmit(event) {
  navigateTo({
    path: "/create-travel",
  });
}
</script>
