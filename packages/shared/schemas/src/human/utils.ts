import * as v from "valibot";

import { Schema as FamilyTreeSchema } from "./family-tree/schemas";
import { KINDS, KindSchema, Schema, WithMetaSchema } from "./schemas";
import { Schema as SimpleSchema } from "./simple/schemas";

type Options = {
  kind?: KindSchema;
  withMeta?: boolean;
};

type PersonResult<O extends Options | undefined> = O extends { kind: typeof KINDS.Simple }
  ? SimpleSchema
  : O extends { kind: typeof KINDS.FamilyTree }
    ? FamilyTreeSchema
    : O extends { withMeta: true }
      ? WithMetaSchema
      : Schema;

function getPersonSchema(option: Options = {}) {
  switch (option.kind) {
    case KINDS.Simple:
      return SimpleSchema;
    case KINDS.FamilyTree:
      return FamilyTreeSchema;
    default:
      return option.withMeta ? WithMetaSchema : Schema;
  }
}

export function parsePerson<O extends Options>(input: unknown, option?: O): PersonResult<O> {
  return v.parse(getPersonSchema(option), input) as PersonResult<O>;
}

export function parsePeople<O extends Options>(input: unknown, option?: O): PersonResult<O>[] {
  return v.parse(v.array(getPersonSchema(option)), input) as PersonResult<O>[];
}
