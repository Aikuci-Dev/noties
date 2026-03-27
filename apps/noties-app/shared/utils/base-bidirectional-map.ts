import type { Id } from "#shared/types/app";

export type TBaseBidirectionalMap<E1 extends { id: Id }, E2 extends { id: Id }> = BaseBidirectionalMap<E1, E2>;
export class BaseBidirectionalMap<E1 extends { id: Id }, E2 extends { id: Id }> {
  protected map1To2 = new Map<E1["id"], E2>();
  protected map2To1 = new Map<E2["id"], E1>();

  protected buildKey(id: Id, prefix?: string) {
    return `${prefix ? prefix + "-" : ""}${id}`;
  }

  get1To2(id: E1["id"], prefix = "map1To2") {
    return this.map1To2.get(this.buildKey(id, prefix));
  }

  get2To1(id: E2["id"], prefix = "map2To1") {
    return this.map2To1.get(this.buildKey(id, prefix));
  }

  set1To2(id: E1["id"], entity: E2, prefix = "map1To2") {
    this.map1To2.set(this.buildKey(id, prefix), entity);
  }

  set2To1(id: E2["id"], entity: E1, prefix = "map2To1") {
    this.map2To1.set(this.buildKey(id, prefix), entity);
  }

  // Optional helper for symmetric set
  set(id1: E1["id"], entity1: E2, id2: E2["id"], entity2: E1, prefix?: string) {
    this.set1To2(id1, entity1, prefix);
    this.set2To1(id2, entity2, prefix);
  }
}
