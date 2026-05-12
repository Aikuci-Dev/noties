import { createCollection, localStorageCollectionOptions } from "@tanstack/vue-db";

import { Human } from "@relaverse/shared-schema";

export const familyTreeCollection = createCollection(
  localStorageCollectionOptions({
    id: "human-family_tree",
    storageKey: "relaverse-human-family_tree",
    getKey: (item) => item.id,
    schema: Human.FamilyTree.Schema,
  }),
);
