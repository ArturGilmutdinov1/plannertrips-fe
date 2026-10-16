import type { AuthResponse, RegisterPayload } from "#shared/types/auth";
import { validateRegister } from "#shared/utils/authValidation";

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  const body = await readBody<Partial<RegisterPayload>>(event);
  const [firstError] = validateRegister(body ?? {});

  if (firstError) {
    throw createError({ statusCode: 400, message: firstError.message });
  }

  const user = await createUser(body as RegisterPayload);
  await createSession(event, user.id);

  setResponseStatus(event, 201);
  return { user };
});
