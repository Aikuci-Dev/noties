import { Human } from "@noties/shared-schema";

import type { Node as PersonNode } from "../types";

function isSimple(person: Human.PersonLike): person is Human.Simple.Schema {
  return Human.KINDS.Simple in person.meta || person.meta.kind === Human.KINDS.Simple;
}

function isFamilyTree(person: Human.PersonLike): person is Human.FamilyTree.Schema {
  return Human.KINDS.FamilyTree in person.meta || person.meta.kind === Human.KINDS.FamilyTree;
}

export function convertPersonToNodePerson(person: Human.PersonLike): PersonNode {
  const { id, name, gender } = person;

  let title = name;
  let subtitle = gender ?? "";
  let isAccent = !gender;

  if (isSimple(person)) isAccent = person.isAccent === true;

  if (isFamilyTree(person)) {
    const { dateOfBirth, dateOfDeath } = person;

    subtitle = [dateOfBirth, dateOfDeath].map((d) => (d ? new Date(d).getFullYear() : "")).join("-");
    isAccent = Boolean(dateOfDeath);
    // generationOrder: isPersonWithMeta(person) ? person.meta.generationOrder : undefined;
  }

  return { id, title, subtitle, gender, isAccent };
}
