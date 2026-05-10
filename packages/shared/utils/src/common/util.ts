export function isEmpty(value: unknown) {
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "string") return value.trim().length === 0;
  if (value && typeof value === "object") return Object.keys(value).length === 0;
  return !value;
}

export const isDefined = <T>(value: T): value is NonNullable<T> => value != null;
