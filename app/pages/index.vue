<template>
  <div>
    <PopularCountriesCarousel />

    <MyTripsCardGrid v-if="auth.isLoggedIn" />

    <UPageCTA
      v-else
      title="Ваши маршруты в одном месте"
      description="Войдите, чтобы создавать поездки и собирать маршрут по дням и местам."
      variant="subtle"
      :links="[
        { label: 'Войти', to: '/login', icon: 'i-lucide-log-in' },
        { label: 'Регистрация', to: '/register', color: 'neutral', variant: 'outline' },
      ]"
    />
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();
</script>
