// Загружаем текущего пользователя один раз: на сервере при SSR,
// на клиенте состояние приходит из payload Pinia.
export default defineNuxtPlugin(async () => {
  const auth = useAuthStore();
  await callOnce("auth:user", () => auth.fetchUser());
});
