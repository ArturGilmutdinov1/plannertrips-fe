<template>
  <UModal
    title="Новый маршрут"
    description="Задайте название и страну, чтобы начать планировать поездку."
  >
    <UButton
      label="Создать маршрут"
      icon="i-lucide-route"
      size="sm"
      class="shadow-sm"
    />

    <template #body>
      <UForm
        :state="state"
        class="space-y-5"
        @submit="onSubmit"
      >
        <div class="space-y-2">
          <label class="text-sm font-medium text-highlighted">
            Название путешествия
          </label>
          <UInput
            v-model="state.name"
            icon="i-lucide-map"
            placeholder="Например, Весна в Грузии"
            size="lg"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-highlighted">
            Страна
          </label>
          <SelectCountry v-model="state.country" />
        </div>

        <div class="flex justify-end pt-2">
          <UButton
            type="submit"
            icon="i-lucide-arrow-right"
            trailing
            size="lg"
            label="Создать"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useTripModalStore } from "../stores/tripModalStore";
import { navigateTo } from "nuxt/app";

type CountryOption = {
  label: string;
  value: string;
};

const modalStore = useTripModalStore();
const state = reactive({
  name: "",
  country: null as CountryOption | null,
});

function onSubmit() {
  modalStore.setTripModalData(state.name, state.country);
  navigateTo({
    path: "/create-travel",
  });
}
</script>
