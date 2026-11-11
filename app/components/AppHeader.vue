<template>
  <UHeader class="border-b border-default/60 bg-default/80 backdrop-blur">
    <template #title>
      <NuxtLink to="/" aria-label="На главную" class="block overflow-hidden">
        <img
          src="/logo.png"
          alt="MyRouteMaker"
          class="hidden h-10 w-auto transition-opacity hover:opacity-90 sm:block"
        />
        <img
          src="/logo-mark.png"
          alt="MyRouteMaker"
          class="size-10 transition-opacity hover:opacity-90 sm:hidden"
        />
      </NuxtLink>
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
          class="max-w-40 sm:max-w-64 [&_.truncate]:truncate"
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
        class="shadow-sm max-sm:[&_.truncate]:hidden"
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
