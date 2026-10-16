// Куда вернуть пользователя после входа. Принимаем только локальные пути,
// чтобы ?redirect=https://evil.example не уводил на чужой сайт.
export function useAuthRedirect() {
  const route = useRoute();

  return computed(() => {
    const redirect = route.query.redirect;
    return typeof redirect === "string" && redirect.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : "/";
  });
}
