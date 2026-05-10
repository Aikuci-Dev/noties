import * as v from "valibot";

import { IntegerSchema } from "@/schemas/app";
// import { exactOptionalUndefinable } from "@/utils/valibot";

// import { Schema as SimpleSchema, Schema as FamilyTreeSchema } from "./simple";

/**
 * =========================
 * PROPERTIES
 * =========================
 */
export const IdSchema = v.pipe(IntegerSchema, v.brand("PersonId"));
export type IdSchema = v.InferOutput<typeof IdSchema>;
export const IdsSchema = v.array(IdSchema);
export type IdsSchema = v.InferOutput<typeof IdsSchema>;

export const GENDERS = ["M", "F"] as const;
export const GenderSchema = v.picklist(GENDERS);
export type GenderSchema = v.InferOutput<typeof GenderSchema>;

export const KINDS = {
  Simple: "Simple",
  FamilyTree: "FamilyTree",
} as const;
export const KindSchema = v.picklist(Object.values(KINDS));
export type KindSchema = v.InferOutput<typeof KindSchema>;

/**
 * =========================
 * DEFAULT
 * =========================
 */
export const defaultId = v.parse(IdSchema, 0);

/**
 * =========================
 * ENTITY
 * =========================
 */
const MetaSchema = v.object({
  kind: v.literal("default"),
  // simple: exactOptionalUndefinable(v.lazy(() => SimpleSchema)),
  // familyTree: exactOptionalUndefinable(v.lazy(() => FamilyTreeSchema)),
});
export const Schema = v.object({
  id: IdSchema,

  name: v.string(),
  gender: v.nullish(GenderSchema),
});
export type Schema = v.InferOutput<typeof Schema>;
export const WithMetaSchema = v.object({ ...Schema.entries, meta: MetaSchema });
export type WithMetaSchema = v.InferOutput<typeof WithMetaSchema>;
