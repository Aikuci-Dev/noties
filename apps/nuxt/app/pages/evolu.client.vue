<template>
  <div>
    <pre>allPeopleSimple - {{ allPeopleSimple }}</pre>
  </div>
</template>

<script setup lang="ts">
import { SimpleName, createEvolu } from "@evolu/common";
import { provideEvolu, useQuery } from "@evolu/vue";
import { evoluWebDeps } from "@evolu/web";

import { EvoluDBSchema } from "@noties/shared-schema";

const evolu = createEvolu(evoluWebDeps)(EvoluDBSchema, {
  name: SimpleName.orThrow("test-sample"),
});

provideEvolu(evolu);

const humanPersonSimple = evolu.createQuery((db) =>
  // db.selectFrom("simple").select(["name", "gender", "isAccent"]).where("isDeleted", "is not", 1).orderBy("createdAt"),
  db.selectFrom("simple").select(["name", "gender", "isAccent"]),
);

const allPeopleSimple = useQuery(humanPersonSimple);

const { insert, update } = evolu;

insert("simple", { name: "name" });

console.log("allPeopleSimple", allPeopleSimple);
</script>
