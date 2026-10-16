// Достаёт текст ошибки из ответа API (createError({ message }) на сервере).
export function getErrorMessage(error: unknown, fallback: string) {
  const data = (error as { data?: { message?: unknown } } | null)?.data;
  return typeof data?.message === "string" ? data.message : fallback;
}
