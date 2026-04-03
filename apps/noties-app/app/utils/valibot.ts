import * as v from "valibot";

export function exactOptionalUndefinedable<TWrapped extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  wrappedSchema: TWrapped,
  defaultValue?: v.InferOutput<TWrapped>,
): v.ExactOptionalSchema<v.UndefinedableSchema<TWrapped, v.InferOutput<TWrapped>>, v.InferOutput<TWrapped>> {
  const withUndefined = v.undefinedable(wrappedSchema, defaultValue);
  return v.exactOptional(withUndefined, defaultValue);
}

export function exactOptionalNullish<TWrapped extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  wrappedSchema: TWrapped,
  defaultValue?: v.InferOutput<TWrapped>,
): v.ExactOptionalSchema<v.NullishSchema<TWrapped, v.InferOutput<TWrapped>>, v.InferOutput<TWrapped>> {
  const withUndefined = v.nullish(wrappedSchema, defaultValue);
  return v.exactOptional(withUndefined, defaultValue);
}
