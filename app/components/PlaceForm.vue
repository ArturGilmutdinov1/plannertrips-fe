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
        <UFormField
          label="Наименование"
          name="name"
          required
        >
          <UInput
            v-model="state.name"
            class="w-full"
          />
        </UFormField>

        <UFormField name="category">
          <USelect
            v-model="state.category"
            placeholder="тип"
            :items="categoryItems"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFileUpload
        v-model="state.img"
        accept="image/*"
        class="w-40 min-h-30 shrink-0"
      />
    </div>
    <UFormField
      label="Расскажите о месте"
      name="description"
    >
      <UTextarea
        v-model="state.description"
        class="w-full"
        autoresize
      />
    </UFormField>

    <UButton
      type="submit"
      :loading="isSubmitting"
    >
      Сохранить
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { CreatePlacePayload, Place } from "#shared/types/place";
import { PLACE_CATEGORIES, PLACE_CATEGORY_LABELS } from "#shared/utils/placeCategories";

const props = defineProps<{ tripId: string }>();

const toast = useToast();

const categoryItems = PLACE_CATEGORIES.map(value => ({ label: PLACE_CATEGORY_LABELS[value], value }));

// 1. Схема валидации
const schema = z.object({
  name: z.string().trim().min(1, "Введите название"),
  category: z.enum(PLACE_CATEGORIES).optional(),
  img: z.custom<File>(value => value instanceof File).nullish(),
  description: z.string().trim().optional(),
});

type Schema = z.output<typeof schema>;

// 2. Реактивное состояние
const state = reactive<Partial<Schema>>({
  name: undefined,
  category: undefined,
  img: undefined,
  description: undefined,
});

const isSubmitting = ref(false);

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// 3. Обработчик отправки
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true;

  try {
    const payload: CreatePlacePayload = {
      name: event.data.name,
      category: event.data.category ?? null,
      description: event.data.description ?? "",
      img: event.data.img ? await readAsDataUrl(event.data.img) : null,
    };

    await $fetch<Place>(`/api/trips/${props.tripId}/places`, {
      method: "POST",
      body: payload,
    });

    await navigateTo(`/trips/${props.tripId}`);
  } catch (error) {
    toast.add({ title: getErrorMessage(error, "Не удалось сохранить место"), color: "error" });
  } finally {
    isSubmitting.value = false;
  }
}
</script>
