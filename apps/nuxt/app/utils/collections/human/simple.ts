import { createCollection, localStorageCollectionOptions } from "@tanstack/vue-db";

import { Human } from "@relaverse/shared-schema";

export const simpleCollection = createCollection(
  localStorageCollectionOptions({
    id: "human-simple",
    storageKey: "relaverse-human-simple",
    getKey: (item) => item.id,
    schema: Human.Simple.Schema,
  }),
);
