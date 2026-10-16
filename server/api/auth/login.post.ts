import type { AuthResponse, LoginPayload } from "#shared/types/auth";
import { validateLogin } from "#shared/utils/authValidation";

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  const body = await readBody<Partial<LoginPayload>>(event);
  const [firstError] = validateLogin(body ?? {});

  if (firstError) {
    throw createError({ statusCode: 400, message: firstError.message });
  }

  const user = await findUserByCredentials(body.email!, body.password!);
  if (!user) {
    throw createError({ statusCode: 401, message: "Неверный email или пароль" });
  }

  await createSession(event, user.id);
  return { user };
});
