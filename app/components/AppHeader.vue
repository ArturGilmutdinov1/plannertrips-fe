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
      <UColorModeButton />

      <UDropdownMenu
        v-if="auth.user"
        :items="userMenu"
        :content="{ align: 'end' }"
      >
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          :label="auth.user.name"
          :avatar="{ alt: auth.user.name }"
          trailing-icon="i-lucide-chevron-down"
        />
      </UDropdownMenu>

      <UButton
        v-else
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

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const auth = useAuthStore();

const userMenu = computed<DropdownMenuItem[][]>(() => [
  [{ label: auth.user?.email, type: "label" }],
  [
    {
      label: "Выйти",
      icon: "i-lucide-log-out",
      color: "error",
      onSelect: logout,
    },
  ],
]);

async function logout() {
  await auth.logout();
  await navigateTo("/");
}
</script>
