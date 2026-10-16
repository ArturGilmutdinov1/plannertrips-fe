import type { AuthResponse, LoginPayload, RegisterPayload, User } from "#shared/types/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
  }),

  getters: {
    isLoggedIn: state => state.user !== null,
  },

  actions: {
    // На сервере useRequestFetch пробрасывает cookie входящего запроса.
    async fetchUser() {
      const { user } = await useRequestFetch()<AuthResponse>("/api/auth/me");
      this.user = user;
    },

    async login(payload: LoginPayload) {
      const { user } = await $fetch<AuthResponse>("/api/auth/login", { method: "POST", body: payload });
      this.user = user;
    },

    async register(payload: RegisterPayload) {
      const { user } = await $fetch<AuthResponse>("/api/auth/register", { method: "POST", body: payload });
      this.user = user;
    },

    async logout() {
      await $fetch("/api/auth/logout", { method: "POST" });
      this.user = null;
      clearNuxtData();
    },
  },
});
