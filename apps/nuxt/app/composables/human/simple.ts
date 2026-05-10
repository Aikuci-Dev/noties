import { createLiveQueryCollection } from "@tanstack/vue-db";

export const useHumanSimpleQuery = createLiveQueryCollection({
  query: (q) => q.from({ simple: simpleCollection }),
  startSync: true,
});
