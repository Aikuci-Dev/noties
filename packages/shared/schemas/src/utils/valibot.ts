import * as v from "valibot";

type TBaseSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

export function normalizeEmptyToNull<TSchema extends TBaseSchema>(schema: TSchema) {
  return v.pipe(
    schema,
    v.transform((input) => {
      const { success: isEmptyString } = v.safeParse(v.pipe(v.string(), v.empty()), input);
      const { success: isEmptyArray } = v.safeParse(v.pipe(v.array(v.any()), v.empty()), input);
      return isEmptyString || isEmptyArray ? null : input;
    }),
  );
}

export function exactOptionalUndefinedable<TWrapped extends TBaseSchema>(
  wrappedSchema: TWrapped,
  defaultValue?: v.InferOutput<TWrapped>,
) {
  const withUndefined = v.undefinedable(wrappedSchema, defaultValue);
  return v.exactOptional(withUndefined, defaultValue);
}

export function exactOptionalNullish<TWrapped extends TBaseSchema>(
  wrappedSchema: TWrapped,
  defaultValue?: v.InferOutput<TWrapped>,
) {
  const withNullish = v.nullish(wrappedSchema, defaultValue);
  return v.exactOptional(withNullish, defaultValue);
}
