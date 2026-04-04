export type Id = string | number;
export type EntityPairKey<T extends { id: Id }> = `${T["id"]}-${T["id"]}`;
