import type { Nullish } from "@noties/shared-type";

export function removeFalsy<T>(array: Nullish<T>[]): T[] {
  return array.filter((item): item is T => Boolean(item));
}

export function intersectionBy<T>(a: T[] = [], b: T[] = [], selector: (item: T) => unknown): T[] {
  const set = new Set(b.map(selector));
  return a.filter((x) => set.has(selector(x)));
}
