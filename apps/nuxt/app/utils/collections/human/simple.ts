import { createCollection, localStorageCollectionOptions } from "@tanstack/vue-db";

import { Human } from "@noties/shared-schema";

export const simpleCollection = createCollection(
  localStorageCollectionOptions({
    id: "human-simple",
    storageKey: "noties-human-simple",
    getKey: (item) => item.id,
    schema: Human.Simple.Schema,
  }),
);
