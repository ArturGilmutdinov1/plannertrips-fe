<template>
  <UForm
    :schema="schema"
    :state="state"
    class="mx-auto w-full max-w-md space-y-4"
    @submit="onSubmit"
  >
    <div class="flex items-start gap-4">
      <!-- левая колонка: два поля столбиком -->
      <div class="flex-1 space-y-4">
        <UFormField label="Наименование" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField name="category">
          <USelect
            placeholder="тип"
            v-model="state.category"
            :items="items"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFileUpload v-model="state.img" class="w-40 min-h-30 shrink-0" />
    </div>
    <UFormField label="Расскажите о месте" name="description">
      <UTextarea v-model="state.description" class="w-full" autoresize />
    </UFormField>

    <UButton type="submit"> Сохранить </UButton>
  </UForm>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { CreatePlacePayload } from "#shared/types/place";
// 1. Схема валидации
const schema = z.object({});

type Schema = z.output<typeof schema>;

// 2. Реактивное состояние
const state = reactive<Partial<Schema>>({
  name: undefined,
  img: undefined,
  description: undefined,
});

// 3. Обработчик отправки
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const data: CreatePlacePayload = {
      name: state.name,
      img: state.img,
      description: state.description,
    };

    const place = await $fetch<Place>("/api/places", {
      method: "POST",
      body: data,
    });
  } catch {}
}
</script>
