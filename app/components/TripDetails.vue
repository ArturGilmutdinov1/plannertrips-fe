<template>
  <UPage>
    <template v-if="!isEditing">
      <UPageHeader
        v-if="!isEditing"
        :title="pageTitle"
        :description="pageDescription"
      >
        <template #links>
          <MapForTrip />
          <PlaceAddButton v-if="places.length" :trip-id="trip.id" />
          <UDropdownMenu
            :items="[
              {
                label: 'Редактировать',
                icon: 'i-lucide-pencil',
                onSelect: editTrip,
              },
              { type: 'separator' },
              {
                label: 'Удалить',
                icon: 'i-lucide-trash-2',
                color: 'error',
                onSelect: removeTrip,
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
        </template>
      </UPageHeader>
    </template>
    <!-- Режим редактирования -->
    <div v-else class="flex w-full items-center gap-2">
      <UInput
        v-model="draftTitle"
        class="w-full"
        autofocus
        @keyup.enter="saveTitle"
        @keyup.esc="cancelEdit"
      />
      <CountrySelect v-model="draftCountry" />
      <UButton
        icon="i-lucide-check"
        color="primary"
        aria-label="Сохранить"
        @click="saveTitle"
      />
      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        aria-label="Отмена"
        @click="cancelEdit"
      />
    </div>

    <UPageBody>
      <div
        v-if="places.length"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <NuxtLink
          v-for="place in places"
          :key="place.id"
          :to="`/trips/${trip.id}/places/${place.id}`"
        >
          <UCard
            class="h-80 overflow-hidden hover:ring-2 hover:ring-primary/50 transition"
          >
            <!-- Шапка есть всегда, чтобы карточки с картинкой и без были одной высоты -->
            <template #header>
              <img
                v-if="place.img"
                :src="place.img"
                :alt="place.name"
                class="h-40 w-full rounded-md object-cover"
              />
              <div
                v-else
                class="flex h-40 w-full items-center justify-center rounded-md bg-elevated"
              >
                <UIcon name="i-lucide-image" class="size-10 text-dimmed" />
              </div>
            </template>

            <div class="space-y-2">
              <div class="flex items-start justify-between gap-2">
                <h3 class="min-w-0 truncate font-semibold text-highlighted">
                  {{ place.name }}
                </h3>
                <UBadge
                  v-if="place.category"
                  :label="PLACE_CATEGORY_LABELS[place.category]"
                  variant="subtle"
                  class="shrink-0"
                />
              </div>
              <p
                v-if="place.description"
                class="line-clamp-2 text-sm text-muted"
              >
                {{ place.description }}
              </p>
            </div>
          </UCard>
        </NuxtLink>
      </div>
      <UCard v-else class="border-dashed">
        <div
          class="flex flex-col items-center justify-center gap-4 py-12 text-center min-h-[400px]"
        >
          <UAvatar
            icon="i-lucide-map-pinned"
            size="xl"
            class="bg-primary/10 text-primary"
          />

          <div class="space-y-2">
            <h2 class="text-lg font-semibold text-highlighted">
              Маршрут пока пустой
            </h2>
            <p class="max-w-md text-sm text-muted">
              Добавьте первые места поездки
            </p>
          </div>
          <PlaceAddButton :trip-id="trip.id" />
        </div>
      </UCard>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import type { Place } from "#shared/types/place";
import type { Trip, UpdateTripPoyload } from "#shared/types/trip";
import { PLACE_CATEGORY_LABELS } from "#shared/utils/placeCategories";
import MapForTrip from "./maps/MapForTrip.vue";

const props = defineProps<{ trip: Trip }>();
const route = useRoute();
const propsCountry = ref(props.trip.country);
const country = computed(() => propsCountry.value);
const tripId = route.params.id as string;

const { data: places } = await useFetch<Place[]>(
  () => `/api/trips/${props.trip.id}/places`,
  {
    default: () => [],
  },
);

const isEditing = ref(false);

const propsTitle = ref(props.trip.name);
const pageTitle = computed(() => propsTitle.value || "Новый маршрут");
const pageDescription = computed(() =>
  props.trip.country?.label
    ? `План поездки: ${country?.value.label}`
    : "Начните собирать маршрут по дням и местам",
);
const draftTitle = ref(pageTitle.value);
const draftCountry = ref<CountryOption | undefined>(country.value);

function editTrip() {
  isEditing.value = true;
}

async function removeTrip() {
  try {
    //  Отправляем запрос на удаление
    await $fetch(`/api/trips/${tripId}`, {
      method: "DELETE",
    });

    // Переходим назад
    await navigateTo(``);
  } catch (error: any) {
    //  Обрабатываем ошибки (например, 404 или 500)
    console.error("Ошибка при удалении:", error);
  }
}

function cancelEdit() {
  isEditing.value = false;
}

async function saveTitle() {
  const payload: UpdateTripPoyload = {
    name: draftTitle.value,
    country: draftCountry.value ?? null,
  };

  try {
    //Отправляем данные
    const responce = await $fetch<UpdateTripPoyload>(`/api/trips/${tripId}`, {
      method: "POST",
      body: payload,
    });

    propsTitle.value = responce.name;
    propsCountry.value = responce.country;
    isEditing.value = false;
  } catch (error: any) {
    //  Обрабатываем ошибки (например, 404 или 500)
    console.error("Ошибка при изменении:", error);
  }
}
</script>
