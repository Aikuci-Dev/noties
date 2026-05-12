import * as v from "valibot";

import { exactOptionalNullish, normalizeEmptyToNull } from "@/utils/valibot";

import { defaultId, GenderSchema, IdSchema, IdsSchema } from "../schemas";

// TODO: Validate that id, children do not contain duplicate IDs.
const ReferenceSchema = v.object({
  id: v.exactOptional(IdSchema, defaultId),
  children: normalizeEmptyToNull(exactOptionalNullish(IdsSchema, [])),
});

const DataSchema = v.object({
  name: v.pipe(v.exactOptional(v.string(), ""), v.nonEmpty("Name is required")),
  gender: exactOptionalNullish(GenderSchema, null),
  isAccent: exactOptionalNullish(v.boolean(), null),
});

export const Schema = v.object({ ...ReferenceSchema.entries, ...DataSchema.entries });
export type Schema = v.InferOutput<typeof Schema>;
export type SchemaInput = v.InferOutput<typeof ReferenceSchema> & // correctly infers branded type
  v.InferInput<typeof DataSchema>;
