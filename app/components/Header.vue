<script setup lang="ts"></script>

<template>
  <UHeader class="border-b border-default/60 bg-default/80 backdrop-blur">
    <template #title>
      <UColorModeImage
        light="/logo.png"
        dark="/logo.png"
        :width="240"
        :height="36"
        class="self-center translate-y-1 transition-opacity hover:opacity-90"
      />
    </template>

    <template #right>
      <ModalCreateTrip />

      <UColorModeButton />

      <UButton
        to="/login"
        icon="i-lucide-log-in"
        color="primary"
        variant="solid"
        size="sm"
        label="Войти"
        class="shadow-sm"
      />
    </template>
  </UHeader>
</template>
