<template>
  <UPage>
    <UPageHeader :title="pageTitle" :description="pageDescription">
      <template #links>
        <div class="grid w-full grid-cols-4 gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <MapForTrip />
          <PlaceAddButton v-if="places.length" :trip-id="trip.id" />
          <ChildTripAddButton
            :trip-id="trip.id"
            :child-trip-ids="childTrips.map((child) => child.id)"
          />
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
              variant="soft"
              icon="i-lucide-ellipsis-vertical"
              label="Действия"
              size="lg"
              class="w-full justify-center sm:w-auto max-sm:[&_.truncate]:hidden"
              aria-label="Действия"
            />
          </UDropdownMenu>
        </div>
      </template>
    </UPageHeader>

    <UPageBody>
      <section v-if="childTrips.length" class="space-y-3">
        <h2 class="text-lg font-semibold">Подключённые маршруты</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <UCard
            v-for="child in childTrips"
            :key="child.id"
            class="hover:ring-2 hover:ring-primary/50 transition"
          >
            <div class="flex items-start justify-between gap-3">
              <NuxtLink :to="`/trips/${child.id}`" class="min-w-0 flex-1">
                <h3 class="truncate font-semibold text-highlighted">
                  {{ child.name }}
                </h3>
                <p class="mt-1 text-sm text-muted">
                  {{
                    child.description
                      || child.country?.label
                      || "Самостоятельный маршрут"
                  }}
                </p>
              </NuxtLink>
              <UButton
                icon="i-lucide-unlink"
                color="neutral"
                variant="ghost"
                aria-label="Отсоединить маршрут"
                @click="detachChild(child.id)"
              />
            </div>
          </UCard>
        </div>
      </section>

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
            class="h-72 overflow-hidden transition hover:ring-2 hover:ring-primary/50 sm:h-80"
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
      <UCard v-else-if="!childTrips.length" class="border-dashed">
        <div
          class="flex min-h-72 flex-col items-center justify-center gap-4 py-8 text-center sm:min-h-96 sm:py-12"
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
          <div class="grid w-full max-w-xs grid-cols-2 gap-2 sm:flex sm:w-auto sm:max-w-none">
            <PlaceAddButton :trip-id="trip.id" />
            <ChildTripAddButton
              :trip-id="trip.id"
              :child-trip-ids="[]"
            />
          </div>
        </div>
      </UCard>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import type { Place } from "#shared/types/place";
import type { Trip } from "#shared/types/trip";
import { PLACE_CATEGORY_LABELS } from "#shared/utils/placeCategories";
import MapForTrip from "./maps/MapForTrip.vue";

const props = defineProps<{ trip: Trip }>();
const route = useRoute();

const { data: places } = await useFetch<Place[]>(
  () => `/api/trips/${props.trip.id}/places`,
  {
    default: () => [],
  },
);

const { data: childTrips } = await useFetch<Trip[]>(
  () => `/api/trips/${props.trip.id}/children`,
  {
    key: `trip-children-${props.trip.id}`,
    default: () => [],
  },
);

const pageTitle = computed(() => props.trip.name || "Новый маршрут");
const pageDescription = computed(() =>
  props.trip.country?.label
    ? `План поездки: ${props.trip.country.label}`
    : "Начните собирать маршрут по дням и местам",
);

async function detachChild(childId: string) {
  await $fetch(`/api/trips/${props.trip.id}/children/${childId}`, {
    method: "DELETE",
  });
  await refreshNuxtData(`trip-children-${props.trip.id}`);
}

async function removeTrip() {
  const tripId = route.params.id as string;

  try {
    // 2. Отправляем запрос на удаление
    await $fetch(`/api/trips/${tripId}`, {
      method: "DELETE",
    });

    // 4. Переходим назад
    await navigateTo(``);
  } catch (error: any) {
    // 5. Обрабатываем ошибки (например, 404 или 500)
    console.error("Ошибка при удалении:", error);
  }
}
</script>
