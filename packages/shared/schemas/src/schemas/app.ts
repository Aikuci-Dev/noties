import * as v from "valibot";

export const IntegerSchema = v.pipe(v.number(), v.safeInteger("The number must be an integer."));

// DATE
export const IsoDateSchema = v.pipe(v.string(), v.isoDate("The date is badly formatted."));
export const IsoTimestampSchema = v.pipe(v.string(), v.isoTimestamp("The timestamp is badly formatted."));
export const UnionDateSchema = v.union([v.date(), IsoDateSchema, IsoTimestampSchema]);

export const IsoDateRangeSchema = v.pipe(v.array(IsoDateSchema), v.maxLength(2));
export const IsoTimestampRangeSchema = v.pipe(v.array(IsoTimestampSchema), v.maxLength(2));
export const UnionDateRangeSchema = v.pipe(v.array(UnionDateSchema), v.maxLength(2));

export const TransformedUnionDateRangeSchema = v.pipe(v.array(v.pipe(UnionDateSchema, v.toDate())), v.maxLength(2));
export const TransformedUnionDateRangeToIsoSchema = v.pipe(
  v.array(
    v.pipe(
      UnionDateSchema,
      v.transform((input) => new Date(input).toISOString()),
    ),
  ),
  v.maxLength(2),
);

export const IdSchema = v.union([IntegerSchema, v.string()]);

// SIZE
export const DimensionSchema = v.object({ height: v.number(), width: v.number() });
