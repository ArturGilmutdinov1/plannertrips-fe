<template>
  <UModal
    title="Новый маршрут"
    description="Задайте название и страну, чтобы начать планировать поездку."
  >
    <UCard
      class="cursor-pointer border-dashed flex items-center justify-center min-h-24 hover:ring-2 hover:ring-primary/50 transition"
      click="onSubmit"
    >
      <div class="flex items-center gap-2 text-primary">
        <UIcon name="i-lucide-plus" class="text-lg" />
        <span class="text-sm font-medium">Добавить маршрут</span>
      </div>
    </UCard>

    <template #body>
      <UForm :state="state" class="space-y-5" @submit="onSubmit">
        <div class="space-y-2">
          <label class="text-sm font-medium text-highlighted">
            Название путешествия
          </label>
          <UInput
            v-model="state.name"
            icon="i-lucide-map"
            placeholder="Например, Весна в Грузии"
            size="lg"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-highlighted"> Страна </label>
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
