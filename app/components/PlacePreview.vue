<template>
  <div class="flex justify-end mb-4">
    <ClientOnly>
      <UDropdownMenu
        :items="[
          {
            label: 'Редактировать',
            icon: 'i-lucide-pencil',
            onSelect: editPlace,
          },
          { type: 'separator' },
          {
            label: 'Удалить',
            icon: 'i-lucide-trash-2',
            color: 'error',
            onSelect: removePlace,
          },
        ]"
      >
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-ellipsis-vertical"
          aria-label="Действия"
        />
      </UDropdownMenu>
    </ClientOnly>
  </div>
  <div v-if="place && !isEditing" class="mx-auto max-w-4xl">
    <UCard class="overflow-hidden">
      <!-- Блок с картинкой (если она есть) -->
      <template v-if="place.img" #header>
        <img
          :src="place.img"
          :alt="place.name"
          class="h-48 w-full object-cover sm:h-96"
        />
      </template>
      <!-- Основной контент -->
      <div class="space-y-6 p-2 sm:p-4">
        <!-- Заголовок и категория (если есть) -->
        <div class="flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <h1
            class="min-w-0 text-2xl font-bold leading-tight text-highlighted break-words sm:text-4xl"
          >
            {{ place.name }}
          </h1>

          <UBadge
            v-if="place.category"
            :label="PLACE_CATEGORY_LABELS[place.category]"
            variant="subtle"
            size="lg"
            class="max-w-full shrink-0"
          />
        </div>

        <!-- Описание -->
        <p
          class="text-base sm:text-lg text-muted leading-relaxed whitespace-pre-line break-words"
        >
          {{ place.description || "Описание пока нет." }}
        </p>
      </div>
    </UCard>
  </div>
  <PlaceForm
    :trip-id="tripId"
    :mode="'edit'"
    :placeToEdit="placeToEdit"
    v-if="isEditing && placeToEdit"
    @edit-place="onPlaceEdited"
  />
</template>

<script setup lang="ts">
import type { Place, UpdatePlacePayload } from "#shared/types/place";
import { PLACE_CATEGORY_LABELS } from "#shared/utils/placeCategories";

const route = useRoute();
const tripId = route.params.id as string;
const placeId = route.params.placeId;

const isEditing = ref(false);

const { data: place, error, refresh } = await useFetch<Place>(
  () => `/api/trips/${tripId}/places/${placeId}`,
);

const placeToEdit = computed<UpdatePlacePayload | null>(() => {
  if (!place.value) return null;
  return {
    name: place.value.name,
    category: place.value.category,
    description: place.value.description ?? "",
    img: place.value.img,
  };
});

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    message: getErrorMessage(error.value, error.value.message),
    fatal: true,
  });
}

async function removePlace() {
  // 1. Берем ID из роута
  const tripId = route.params.id as string;
  const placeId = route.params.placeId as string;

  try {
    // 2. Отправляем запрос на удаление
    await $fetch(`/api/trips/${tripId}/places/${placeId}`, {
      method: "DELETE",
    });

    // 4. Обновляем данные или переходим назад
    await navigateTo(`/trips/${tripId}`);
  } catch (error: any) {
    // 5. Обрабатываем ошибки (например, 404 или 500)
    console.error("Ошибка при удалении:", error);
  }
}

function editPlace() {
  isEditing.value = !isEditing.value;
}

async function onPlaceEdited() {
  await refresh();
  isEditing.value = false;
}
</script>
