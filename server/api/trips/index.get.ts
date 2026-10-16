export default defineEventHandler(async () => {
  const trips = await getTrips();
  return trips.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
});
