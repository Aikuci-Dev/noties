import { createLiveQueryCollection } from "@tanstack/vue-db";

export const useHumanFamilyTreeQuery = createLiveQueryCollection({
  query: (q) => q.from({ simple: familyTreeCollection }),
  startSync: true,
});
