import { beforeEach, describe, expect, it, vi } from "vitest";

describe("ссылки между маршрутами", () => {
  let storage: Map<string, unknown>;

  beforeEach(() => {
    storage = new Map([
      ["mock:trips", [
        { id: "a", ownerId: "alice", name: "A", childTripIds: ["b"], createdAt: "" },
        { id: "b", ownerId: "alice", name: "B", childTripIds: ["c"], createdAt: "" },
        { id: "c", ownerId: "alice", name: "C", childTripIds: [], createdAt: "" },
        {
          id: "foreign",
          ownerId: "bob",
          name: "Чужой",
          childTripIds: [],
          createdAt: "",
        },
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
  });

  it("запрещает циклическую ссылку", async () => {
    const { attachChildTrip } = await import("../server/utils/tripsStorage");

    await expect(attachChildTrip("alice", "c", "a")).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it("не позволяет подключить чужой маршрут", async () => {
    const { attachChildTrip } = await import("../server/utils/tripsStorage");

    await expect(attachChildTrip("alice", "a", "foreign")).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("отсоединяет маршрут, не удаляя его", async () => {
    const { detachChildTrip } = await import("../server/utils/tripsStorage");
    await detachChildTrip("alice", "a", "b");

    const trips = storage.get("mock:trips") as Array<{
      id: string;
      childTripIds: string[];
    }>;
    expect(trips.find((trip) => trip.id === "a")?.childTripIds).toEqual([]);
    expect(trips.some((trip) => trip.id === "b")).toBe(true);
  });

  it("при удалении очищает входящие ссылки", async () => {
    const { removeTrip } = await import("../server/utils/tripsStorage");
    await removeTrip("b");

    const trips = storage.get("mock:trips") as Array<{
      id: string;
      childTripIds: string[];
    }>;
    expect(trips.some((trip) => trip.id === "b")).toBe(false);
    expect(trips.find((trip) => trip.id === "a")?.childTripIds).toEqual([]);
    expect(trips.some((trip) => trip.id === "c")).toBe(true);
  });
});
