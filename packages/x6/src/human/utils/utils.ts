import type { Person, PersonWithMeta } from "@noties/shared-type";

import type { Node as PersonNode } from "../types";

function isPersonWithMeta(person: Person | PersonWithMeta): person is PersonWithMeta {
  return "meta" in person;
}

export function convertPersonToNodePerson(person: Person | PersonWithMeta): PersonNode {
  const base = isPersonWithMeta(person) ? (({ meta: _, ...r }) => r)(person) : person;
  const { name, dateOfBirth, dateOfDeath, ...rest } = base;

  return {
    ...rest,
    title: name,
    subtitle: [dateOfBirth, dateOfDeath].map((d) => (d ? new Date(d).getFullYear() : "")).join("-"),
    generationOrder: isPersonWithMeta(person) ? person.meta.generationOrder : undefined,
    isDead: !!dateOfDeath,
  };
}
