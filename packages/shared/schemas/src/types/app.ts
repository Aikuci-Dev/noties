import * as v from "valibot";

import { DimensionSchema, IdSchema } from "../schemas";

// APP
export type Id = v.InferOutput<typeof IdSchema>;
export type EntityId<T extends Id> = T;
export type EntityPairKey<T extends { id: Id }> = `${T["id"]}-${T["id"]}`;

export type Nullish<T> = T | null | undefined;

// SIZE
export type Dimension = v.InferOutput<typeof DimensionSchema>;
