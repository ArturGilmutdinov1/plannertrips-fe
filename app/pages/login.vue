<template>
  <div class="flex justify-center py-8">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        title="Вход"
        description="Войдите, чтобы планировать поездки"
        icon="i-lucide-log-in"
        :fields="fields"
        :validate="validateLogin"
        :submit="{ label: 'Войти', block: true }"
        :loading="isSubmitting"
        @submit="onSubmit"
      >
        <template #description>
          Нет аккаунта?
          <ULink
            to="/register"
            class="font-medium text-primary"
          >
            Зарегистрируйтесь
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

        <template #footer>
          <UAlert
            color="info"
            variant="subtle"
            icon="i-lucide-info"
            title="Демо-доступ"
            description="demo@plannertrips.ru / demo1234"
          />
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import type { LoginPayload } from "#shared/types/auth";
import { validateLogin } from "#shared/utils/authValidation";

definePageMeta({ middleware: "guest" });
useSeoMeta({ title: "Вход" });

const auth = useAuthStore();
const redirectTo = useAuthRedirect();

const isSubmitting = ref(false);
const errorMessage = ref("");

const fields: AuthFormField[] = [
  { name: "email", type: "email", label: "Email", placeholder: "you@example.com", required: true },
  { name: "password", type: "password", label: "Пароль", placeholder: "Введите пароль", required: true },
];

async function onSubmit(event: FormSubmitEvent<LoginPayload>) {
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await auth.login(event.data);
    await navigateTo(redirectTo.value);
  } catch (error) {
    errorMessage.value = getErrorMessage(error, "Не удалось войти");
  } finally {
    isSubmitting.value = false;
  }
}
</script>
