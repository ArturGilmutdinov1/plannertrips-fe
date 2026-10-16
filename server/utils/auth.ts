// Мок-авторизация, пока нет бэкенда: пользователи и сессии лежат в Nitro storage,
// сессия передаётся через httpOnly-cookie.
import type { H3Event } from "h3";
import type { RegisterPayload, User } from "#shared/types/auth";

export const DEMO_USER_ID = "demo";

const USERS_KEY = "mock:users";
const SESSION_PREFIX = "mock:sessions:";
const SESSION_COOKIE = "pt_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

interface StoredUser extends User {
  passwordHash: string;
}

interface Session {
  userId: string;
  expiresAt: number;
}

const encoder = new TextEncoder();

function toHex(bytes: ArrayBuffer | Uint8Array) {
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password: string, salt = toHex(crypto.getRandomValues(new Uint8Array(16)))) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: encoder.encode(salt), iterations: 100_000 },
    key,
    256,
  );
  return `${salt}:${toHex(bits)}`;
}

async function verifyPassword(password: string, passwordHash: string) {
  const [salt] = passwordHash.split(":");
  return Boolean(salt) && (await hashPassword(password, salt)) === passwordHash;
}

function toPublicUser({ passwordHash: _passwordHash, ...user }: StoredUser): User {
  return user;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function getUsers(): Promise<StoredUser[]> {
  const storage = useStorage("data");
  const users = await storage.getItem<StoredUser[]>(USERS_KEY);
  if (users) return users;

  const seed: StoredUser[] = [{
    id: DEMO_USER_ID,
    name: "Демо Пользователь",
    email: "demo@plannertrips.ru",
    passwordHash: await hashPassword("demo1234"),
  }];
  await storage.setItem(USERS_KEY, seed);
  return seed;
}

export async function findUserByCredentials(email: string, password: string): Promise<User | null> {
  const user = (await getUsers()).find(item => item.email === normalizeEmail(email));

  return user && (await verifyPassword(password, user.passwordHash)) ? toPublicUser(user) : null;
}

export async function createUser(payload: RegisterPayload): Promise<User> {
  const users = await getUsers();
  const email = normalizeEmail(payload.email);

  if (users.some(item => item.email === email)) {
    throw createError({ statusCode: 409, message: "Пользователь с таким email уже существует" });
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: payload.name.trim(),
    email,
    passwordHash: await hashPassword(payload.password),
  };
  await useStorage("data").setItem(USERS_KEY, [...users, user]);

  return toPublicUser(user);
}

export async function createSession(event: H3Event, userId: string) {
  const token = crypto.randomUUID();
  const session: Session = { userId, expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000 };

  await useStorage("data").setItem(SESSION_PREFIX + token, session);
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: !import.meta.dev,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession(event: H3Event) {
  const token = getCookie(event, SESSION_COOKIE);
  if (token) {
    await useStorage("data").removeItem(SESSION_PREFIX + token);
  }
  deleteCookie(event, SESSION_COOKIE, { path: "/" });
}

export async function getSessionUser(event: H3Event): Promise<User | null> {
  const token = getCookie(event, SESSION_COOKIE);
  if (!token) return null;

  const storage = useStorage("data");
  const session = await storage.getItem<Session>(SESSION_PREFIX + token);
  if (!session || session.expiresAt < Date.now()) {
    await storage.removeItem(SESSION_PREFIX + token);
    return null;
  }

  const user = (await getUsers()).find(item => item.id === session.userId);
  return user ? toPublicUser(user) : null;
}

export async function requireUser(event: H3Event): Promise<User> {
  const user = await getSessionUser(event);
  if (!user) {
    throw createError({ statusCode: 401, message: "Требуется авторизация" });
  }
  return user;
}
