export * from "./utils";

import * as v from "valibot";

export const IntegerSchema = v.pipe(v.number(), v.integer("The number must be an integer."));
export const IsoDateSchema = v.pipe(v.string(), v.isoDate("The date is badly formatted."));
