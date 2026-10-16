export default defineNuxtRouteMiddleware((to) => {
  if (!useAuthStore().isLoggedIn) {
    return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
  }
});
