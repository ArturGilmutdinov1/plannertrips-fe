<template>
  <UModal
    v-model:open="isOpen"
    title="Новый маршрут"
    description="Задайте название и страну, чтобы начать планировать поездку."
  >
    <UCard
      class="cursor-pointer border-dashed flex items-center justify-center min-h-24 hover:ring-2 hover:ring-primary/50 transition"
    >
      <div class="flex items-center gap-2 text-primary">
        <UIcon
          name="i-lucide-plus"
          class="text-lg"
        />
        <span class="text-sm font-medium">Добавить маршрут</span>
      </div>
    </UCard>

    <template #body>
      <UForm
        :state="state"
        :validate="validate"
        class="space-y-5"
        @submit="onSubmit"
      >
        <UFormField
          label="Название путешествия"
          name="name"
          required
        >
          <UInput
            v-model="state.name"
            icon="i-lucide-map"
            placeholder="Например, Весна в Грузии"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Страна"
          name="country"
        >
          <CountrySelect v-model="state.country" />
        </UFormField>

        <div class="flex justify-end pt-2">
          <UButton
            type="submit"
            icon="i-lucide-arrow-right"
            trailing
            size="lg"
            label="Создать"
            :loading="isSubmitting"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormError } from "@nuxt/ui";
import type {
  CountryOption,
  CreateTripPayload,
  Trip,
} from "#shared/types/trip";

const toast = useToast();

const isOpen = ref(false);
const isSubmitting = ref(false);
const state = reactive<{ name: string; country: CountryOption | undefined }>({
  name: "",
  country: undefined,
});

function validate(form: Partial<typeof state>): FormError[] {
  return form.name?.trim()
    ? []
    : [{ name: "name", message: "Введите название" }];
}

async function onSubmit() {
  isSubmitting.value = true;

  try {
    const payload: CreateTripPayload = {
      name: state.name,
      country: state.country ?? null,
    };
    const trip = await $fetch<Trip>("/api/trips", {
      method: "POST",
      body: payload,
    });

    isOpen.value = false;
    state.name = "";
    state.country = undefined;

    await refreshNuxtData("trips");
    await navigateTo(`/trips/${trip.id}`);
  } catch {
    toast.add({ title: "Не удалось создать маршрут", color: "error" });
  } finally {
    isSubmitting.value = false;
  }
}
</script>
