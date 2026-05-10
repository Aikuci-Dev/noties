import * as v from "valibot";

import { TransformedUnionDateRangeToIsoSchema } from "@/schemas/app";
import { exactOptionalNullish, normalizeEmptyToNull } from "@/utils/valibot";

import { defaultId, GenderSchema, IdSchema, IdsSchema } from "../schemas";
import { ParentSchema } from "./schemas";

// TODO: Validate that id, parent, partner, and children do not contain duplicate IDs.
const ReferenceSchema = v.object({
  id: v.exactOptional(IdSchema, defaultId),
  parent: normalizeEmptyToNull(exactOptionalNullish(ParentSchema, [])),
  partners: normalizeEmptyToNull(exactOptionalNullish(IdsSchema, [])),
  children: normalizeEmptyToNull(exactOptionalNullish(IdsSchema, [])),
});

const DataSchema = v.object({
  name: v.pipe(v.exactOptional(v.string(), ""), v.nonEmpty("Name is required")),
  gender: exactOptionalNullish(GenderSchema, null),
  life_span: exactOptionalNullish(TransformedUnionDateRangeToIsoSchema, []),
});

export const Schema = v.object({ ...ReferenceSchema.entries, ...DataSchema.entries });
export type Schema = v.InferOutput<typeof Schema>;
export type SchemaInput = v.InferOutput<typeof ReferenceSchema> & // correctly infers branded type
  v.InferInput<typeof DataSchema>;
