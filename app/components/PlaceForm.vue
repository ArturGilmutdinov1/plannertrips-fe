<template>
  <UForm
    :schema="schema"
    :state="state"
    class="mx-auto w-full max-w-2xl space-y-4"
    @submit="onSubmit"
  >
    <div class="flex flex-col items-stretch gap-4 sm:flex-row sm:items-start">
      <!-- левая колонка: два поля столбиком -->
      <div class="flex-1 space-y-4">
        <UFormField label="Наименование" name="name" required>
          <UInput v-model="state.name" class="w-full" />
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
        class="min-h-36 w-full shrink-0 sm:min-h-30 sm:w-40"
      />
    </div>
    <UFormField label="Расскажите о месте" name="description">
      <UTextarea v-model="state.description" class="w-full" autoresize />
    </UFormField>

    <UButton
      type="submit"
      :loading="isSubmitting"
      class="w-full justify-center sm:w-auto"
    >
      Сохранить
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type {
  CreatePlacePayload,
  Place,
  UpdatePlacePayload,
} from "#shared/types/place";
import {
  PLACE_CATEGORIES,
  PLACE_CATEGORY_LABELS,
} from "#shared/utils/placeCategories";

const emit = defineEmits(["editPlace"]);
const props = defineProps<{
  tripId: string;
  mode: "create" | "edit";
  placeToEdit?: UpdatePlacePayload;
}>();
const route = useRoute();
const toast = useToast();

const placeId = route.params.placeId;

const categoryItems = PLACE_CATEGORIES.map((value) => ({
  label: PLACE_CATEGORY_LABELS[value],
  value,
}));

// 1. Схема валидации
const schema = z.object({
  name: z.string().trim().min(1, "Введите название"),
  category: z.enum(PLACE_CATEGORIES).optional(),
  img: z.custom<File>((value) => value instanceof File).nullish(),
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

if (props.placeToEdit) {
  state.name = props.placeToEdit.name;
  state.category = props.placeToEdit.category ?? undefined;
  state.description = props.placeToEdit.description;
}

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

  if (props.mode === "create") {
    await createPlace(event.data);
  } else if (props.mode === "edit") {
    await editPlace(event.data);
  }
}

async function createPlace(data: Schema) {
  isSubmitting.value = true;

  try {
    const payload: CreatePlacePayload = {
      name: data.name,
      category: data.category ?? null,
      description: data.description ?? "",
      img: data.img ? await readAsDataUrl(data.img) : null,
    };

    await $fetch<Place>(`/api/trips/${props.tripId}/places`, {
      method: "POST",
      body: payload,
    });

    await navigateTo(`/trips/${props.tripId}`);
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, "Не удалось сохранить место"),
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}

async function editPlace(data: Schema) {
  try {
    const payload: UpdatePlacePayload = {
      name: data.name,
      category: data.category ?? null,
      description: data.description ?? "",
      img: data.img ? await readAsDataUrl(data.img) : props.placeToEdit?.img ?? null,
    };

    await $fetch<Place>(`/api/trips/${props.tripId}/places/${placeId}`, {
      method: "POST",
      body: payload,
    });
    emit("editPlace");
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, "Не удалось изменить место"),
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>
