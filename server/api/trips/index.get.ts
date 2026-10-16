export default defineEventHandler(async (event) => {
  const user = await requireUser(event);
  const trips = await getUserTrips(user.id);
  return trips.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
});
