export default defineEventHandler(async (event) => {
  await destroySession(event);
  setResponseStatus(event, 204);
});
