export type Nullable<T> = T | null | undefined;

export function removeFalsy<T>(array: Nullable<T>[]): T[] {
  return array.filter((item): item is T => Boolean(item));
}

export function minMax(a: number, b: number): readonly [number, number] {
  return [Math.min(a, b), Math.max(a, b)];
}

export function createPairKey<T extends { id: Id }>(id1: Id, id2: Id): EntityPairKey<T> {
  return createPairKeyWithParts(id1, id2).key;
}
type PairKeyParts<T extends { id: Id }> = {
  key: EntityPairKey<T>;
  prefix: string;
  suffix: string;
};
export function createPairKeyWithParts<T extends { id: Id }>(id1: Id, id2: Id): PairKeyParts<T> {
  const a = String(id1);
  const b = String(id2);

  const [first, second] = a < b ? [a, b] : [b, a];

  return { key: `${second}-${first}`, prefix: second, suffix: first };
}
