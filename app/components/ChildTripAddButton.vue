<template>
  <div class="w-full sm:w-auto">
    <UDropdownMenu :items="menuItems">
      <UButton
        icon="i-lucide-list-plus"
        variant="soft"
        trailing-icon="i-lucide-chevron-down"
        aria-label="Добавить маршрут"
      />
    </UDropdownMenu>

    <UModal
      v-model:open="isCreateOpen"
      title="Новый маршрут"
      description="Маршрут будет создан и сразу подключён к текущему."
    >
      <template #body>
        <UForm
          :state="createState"
          :validate="validateCreate"
          class="space-y-5"
          @submit="createChildTrip"
        >
          <UFormField label="Название" name="name" required>
            <UInput
              v-model="createState.name"
              placeholder="Например, Рим на три дня"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Страна" name="country">
            <CountrySelect v-model="createState.country" />
          </UFormField>
          <div class="flex justify-stretch sm:justify-end">
            <UButton
              type="submit"
              label="Создать и подключить"
              :loading="isSubmitting"
              class="w-full justify-center sm:w-auto"
            />
          </div>
        </UForm>
      </template>
    </UModal>

    <UModal
      v-model:open="isAttachOpen"
      title="Подключить маршрут"
      description="Выберите существующий маршрут. Он останется самостоятельным."
    >
      <template #body>
        <UForm class="space-y-5" :state="attachState" @submit="attachTrip">
          <UFormField label="Маршрут" name="trip" required>
            <USelectMenu
              v-model="attachState.trip"
              :items="availableTrips"
              label-key="name"
              placeholder="Выберите маршрут"
              class="w-full"
            />
          </UFormField>
          <p v-if="!availableTrips.length" class="text-sm text-muted">
            Нет маршрутов, которые можно подключить.
          </p>
          <div class="flex justify-stretch sm:justify-end">
            <UButton
              type="submit"
              label="Подключить"
              :disabled="!attachState.trip"
              :loading="isSubmitting"
              class="w-full justify-center sm:w-auto"
            />
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { FormError } from "@nuxt/ui";
import type { CountryOption, Trip } from "#shared/types/trip";

const props = defineProps<{
  tripId: string;
  childTripIds: string[];
}>();

const toast = useToast();
const isCreateOpen = ref(false);
const isAttachOpen = ref(false);
const isSubmitting = ref(false);
const createState = reactive<{
  name: string;
  country: CountryOption | undefined;
}>({ name: "", country: undefined });
const attachState = reactive<{ trip: Trip | undefined }>({ trip: undefined });

const { data: trips } = await useFetch<Trip[]>("/api/trips", {
  key: "trips",
  default: () => [],
});

const availableTrips = computed(() =>
  trips.value.filter(
    (trip) =>
      trip.id !== props.tripId && !props.childTripIds.includes(trip.id),
  ),
);

const menuItems = [
  {
    label: "Создать новый",
    icon: "i-lucide-plus",
    onSelect: () => { isCreateOpen.value = true; },
  },
  {
    label: "Подключить существующий",
    icon: "i-lucide-link",
    onSelect: () => { isAttachOpen.value = true; },
  },
];

function validateCreate(state: Partial<typeof createState>): FormError[] {
  return state.name?.trim()
    ? []
    : [{ name: "name", message: "Введите название" }];
}

async function refreshTrips() {
  await Promise.all([
    refreshNuxtData("trips"),
    refreshNuxtData(`trip-children-${props.tripId}`),
  ]);
}

async function createChildTrip() {
  isSubmitting.value = true;
  try {
    await $fetch(`/api/trips/${props.tripId}/children`, {
      method: "POST",
      body: {
        name: createState.name,
        country: createState.country ?? null,
      },
    });
    createState.name = "";
    createState.country = undefined;
    isCreateOpen.value = false;
    await refreshTrips();
  } catch {
    toast.add({ title: "Не удалось создать маршрут", color: "error" });
  } finally {
    isSubmitting.value = false;
  }
}

async function attachTrip() {
  if (!attachState.trip) return;
  isSubmitting.value = true;
  try {
    await $fetch(`/api/trips/${props.tripId}/children`, {
      method: "POST",
      body: { childTripId: attachState.trip.id },
    });
    attachState.trip = undefined;
    isAttachOpen.value = false;
    await refreshTrips();
  } catch (error) {
    const message = getErrorMessage(error, "Не удалось подключить маршрут");
    toast.add({ title: message, color: "error" });
  } finally {
    isSubmitting.value = false;
  }
}
</script>
