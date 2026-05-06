import * as v from "valibot";

import { PersonSchema, PersonWithMetaSchema } from "./person";

export function parsePersonWithMeta(input: unknown) {
  return v.parse(PersonWithMetaSchema, input);
}

export function parsePeopleWithMeta(input: unknown) {
  return v.parse(v.array(PersonWithMetaSchema), input);
}

export function parsePerson(input: unknown) {
  return v.parse(PersonSchema, input);
}

export function parsePeople(input: unknown) {
  return v.parse(v.array(PersonSchema), input);
}
