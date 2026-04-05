import * as v from "valibot";

import { PersonSchema, PersonWithMetaSchema } from "./person";

export function parsePersonWithMeta(person: unknown) {
  return v.parse(PersonWithMetaSchema, person);
}

export function parsePeopleWithMeta(people: unknown) {
  return v.parse(v.array(PersonWithMetaSchema), people);
}

export function parsePerson(person: unknown) {
  return v.parse(PersonSchema, person);
}

export function parsePeople(people: unknown) {
  return v.parse(v.array(PersonSchema), people);
}
