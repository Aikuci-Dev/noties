import * as v from "valibot";

import { IdsSchema, Schema as BaseSchema, KINDS } from "../schemas";

/**
 * =========================
 * PROPERTIES
 * =========================
 */

/**
 * =========================
 * ENTITY
 * =========================
 */
const MetaSchema = v.object({
  kind: v.literal(KINDS.Simple),
});
export const Schema = v.object({
  ...BaseSchema.entries,
  meta: MetaSchema,

  isAccent: v.nullish(v.boolean()),
  childrenIds: v.nullish(IdsSchema),
});
export type Schema = v.InferOutput<typeof Schema>;
