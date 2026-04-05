export type Id = string | number;
export type EntityId<T extends Id> = T;
export type EntityPairKey<T extends { id: Id }> = `${T["id"]}-${T["id"]}`;
