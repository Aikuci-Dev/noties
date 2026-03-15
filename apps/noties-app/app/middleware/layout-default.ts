export default defineNuxtRouteMiddleware(() => {
  // TODO: Retrieve alert info from DB
  setPageLayout("default", { alert: true, alertDetails: { title: "Alert" } });
});
