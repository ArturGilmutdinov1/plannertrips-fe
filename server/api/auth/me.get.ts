import type { AuthResponse } from "#shared/types/auth";

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  return { user: await getSessionUser(event) };
});
