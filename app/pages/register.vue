<template>
  <div class="flex justify-center py-8">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        title="Регистрация"
        description="Создайте аккаунт, чтобы сохранять маршруты"
        icon="i-lucide-user-plus"
        :fields="fields"
        :validate="validateRegister"
        :submit="{ label: 'Создать аккаунт', block: true }"
        :loading="isSubmitting"
        @submit="onSubmit"
      >
        <template #description>
          Уже есть аккаунт?
          <ULink
            :to="{ path: '/login', query: $route.query }"
            class="font-medium text-primary"
          >
            Войдите
          </ULink>
        </template>

        <template #validation>
          <UAlert
            v-if="errorMessage"
            color="error"
            variant="subtle"
            icon="i-lucide-circle-alert"
            :title="errorMessage"
          />
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import type { RegisterPayload } from "#shared/types/auth";
import { MIN_PASSWORD_LENGTH, validateRegister } from "#shared/utils/authValidation";

definePageMeta({ middleware: "guest" });
useSeoMeta({ title: "Регистрация" });

const auth = useAuthStore();
const redirectTo = useAuthRedirect();

const isSubmitting = ref(false);
const errorMessage = ref("");

const fields: AuthFormField[] = [
  { name: "name", type: "text", label: "Имя", placeholder: "Как к вам обращаться", required: true },
  { name: "email", type: "email", label: "Email", placeholder: "you@example.com", required: true },
  {
    name: "password",
    type: "password",
    label: "Пароль",
    placeholder: `Минимум ${MIN_PASSWORD_LENGTH} символов`,
    required: true,
  },
];

async function onSubmit(event: FormSubmitEvent<RegisterPayload>) {
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await auth.register(event.data);
    await navigateTo(redirectTo.value);
  } catch (error) {
    errorMessage.value = getErrorMessage(error, "Не удалось зарегистрироваться");
  } finally {
    isSubmitting.value = false;
  }
}
</script>
