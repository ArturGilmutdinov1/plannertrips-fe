// Общие правила валидации: используются и в формах, и в серверных обработчиках.
import type { LoginPayload, RegisterPayload } from "#shared/types/auth";

export interface FieldError {
  name: string;
  message: string;
}

export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(data: Partial<LoginPayload>): FieldError[] {
  const errors: FieldError[] = [];

  if (!data.email?.trim()) {
    errors.push({ name: "email", message: "Введите email" });
  }
  if (!data.password) {
    errors.push({ name: "password", message: "Введите пароль" });
  }

  return errors;
}

export function validateRegister(data: Partial<RegisterPayload>): FieldError[] {
  const errors: FieldError[] = [];

  if (!data.name?.trim()) {
    errors.push({ name: "name", message: "Введите имя" });
  }
  if (!data.email?.trim()) {
    errors.push({ name: "email", message: "Введите email" });
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.push({ name: "email", message: "Некорректный email" });
  }
  if (!data.password || data.password.length < MIN_PASSWORD_LENGTH) {
    errors.push({ name: "password", message: `Минимум ${MIN_PASSWORD_LENGTH} символов` });
  }

  return errors;
}
