<template>
  <UModal title="Маршрут">
    <UButton label="Создать маршрут" />
    <template #body>
      <UForm :state="state" @submit="onSubmit">
        <div>
          Название путешествия
          <UInput v-model="state.name" />
        </div>
        <div>Страна <SelectCountry /></div>
        <UButton type="submit">Создать</UButton>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useTripModalStore } from "../stores/tripModalStore";
import { navigateTo } from "nuxt/app";

const modalStore = useTripModalStore();
const state = reactive({
  name: "",
  country: "",
});

function onSubmit(event) {
  modalStore.setTripModalData(state.name, state.country);
  navigateTo({
    path: "/create-travel",
  });
}
</script>
