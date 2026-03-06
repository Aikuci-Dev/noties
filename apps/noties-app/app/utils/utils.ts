export type Nullable<T> = T | null | undefined;

export function removeFalsy<T>(array: Nullable<T>[]): T[] {
  return array.filter((item): item is T => Boolean(item));
}
