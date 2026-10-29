<template>
  <UModal
    v-model:open="isMapView"
    title="Карта поездки"
    :ui="{ content: 'sm:max-w-6xl' }"
  >
    <UButton
      icon="i-lucide-map"
      label="Показать на карте"
      color="secondary"
      variant="soft"
    />

    <template #body>
      <div class="relative">
        <LMap
          style="height: 350px"
          :zoom="2"
          :center="[47.21322, -1.559482]"
          :use-global-leaflet="false"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
            layer-type="base"
            name="OpenStreetMap"
            @load="isMapLoading = false"
          />
        </LMap>

        <!-- z-[1000] — выше панелей и контролов Leaflet -->
        <div
          v-if="isMapLoading"
          class="absolute inset-0 z-[1000] flex flex-col items-center justify-center gap-2 bg-default/80 backdrop-blur-sm"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="size-8 animate-spin text-primary"
          />
          <span class="text-sm text-muted">Загружаем карту…</span>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isMapView = ref(false);
const isMapLoading = ref(true);

// Тело модалки монтируется заново при каждом открытии, поэтому и лоадер показываем заново.
watch(isMapView, (open) => {
  if (open) isMapLoading.value = true;
});
</script>
