import { beforeEach, describe, expect, it, vi } from "vitest";

describe("DELETE /api/trips/:id — права доступа", () => {
  let storage: Map<string, unknown>;

  beforeEach(() => {
    storage = new Map([
      ["mock:trips", [
        { id: "own-trip", ownerId: "alice", name: "Своя поездка" },
        { id: "other-trip", ownerId: "bob", name: "Чужая поездка" },
      ]],
    ]);

    vi.stubGlobal("DEMO_USER_ID", "demo");
    vi.stubGlobal("useStorage", () => ({
      getItem: async (key: string) => structuredClone(storage.get(key)),
      setItem: async (key: string, value: unknown) => {
        storage.set(key, structuredClone(value));
      },
    }));
    vi.stubGlobal("createError", (options: { statusCode: number; message: string }) =>
      Object.assign(new Error(options.message), options));
    vi.stubGlobal("defineEventHandler", (handler: unknown) => handler);
    vi.stubGlobal("requireUser", async () => ({ id: "alice" }));
  });

  async function deleteTrip(tripId: string) {
    // Проверяем настоящий обработчик и хранилище; заменяем только окружение Nitro.
    const trips = await import("../server/utils/tripsStorage");
    vi.stubGlobal("requireUserTrip", trips.requireUserTrip);
    vi.stubGlobal("removeTrip", trips.removeTrip);
    vi.stubGlobal("getRouterParam", () => tripId);
    const { default: handler } = await import("../server/api/trips/[id].delete");
    return handler({} as Parameters<typeof handler>[0]);
  }

  it("удаляет свою поездку, сохраняя поездку другого пользователя", async () => {
    await deleteTrip("own-trip");

    expect(storage.get("mock:trips")).toEqual([
      { id: "other-trip", ownerId: "bob", name: "Чужая поездка" },
    ]);
  });

  it("возвращает 404 при попытке удалить чужую поездку и сохраняет данные", async () => {
    const original = structuredClone(storage.get("mock:trips"));

    await expect(deleteTrip("other-trip")).rejects.toMatchObject({ statusCode: 404 });

    expect(storage.get("mock:trips")).toEqual(original);
  });
});
