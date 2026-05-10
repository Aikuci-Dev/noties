import * as v from "valibot";

import { IsoDateSchema } from "@/schemas/app";

import { IdSchema, IdsSchema, WithMetaSchema as BaseSchema, KINDS } from "../schemas";

/**
 * =========================
 * PROPERTIES
 * =========================
 */
export const ParentSchema = v.pipe(IdsSchema, v.maxLength(2));

/**
 * =========================
 * ENTITY
 * =========================
 */
const MetaSchema = v.object({
  kind: v.literal(KINDS.FamilyTree),
  partnerId: v.exactOptional(IdSchema), // Current Partner
  // generationOrder: exactOptionalUndefinable(v.number()),
});
export const Schema = v.object({
  ...BaseSchema.entries,
  meta: MetaSchema,

  dateOfBirth: v.nullish(IsoDateSchema),
  dateOfDeath: v.nullish(IsoDateSchema),
  parentIds: v.nullish(ParentSchema),
  partnerIds: v.nullish(IdsSchema),
  childrenIds: v.nullish(IdsSchema),
});
export type Schema = v.InferOutput<typeof Schema>;
