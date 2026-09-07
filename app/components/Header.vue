<script setup lang="ts"></script>

<template>
  <UHeader>
    <template #title>
      <UColorModeImage
        light="/logo.png"
        dark="/logo.png"
        :width="240"
        :height="36"
        class="self-center translate-y-1"
      />
    </template>

    <template #right>
      <ModalCreateRoute />

      <UColorModeButton />

      <UButton
        to="/login"
        color="primary"
        variant="solid"
        size="sm"
        label="Войти"
      />
    </template>
  </UHeader>
</template>
