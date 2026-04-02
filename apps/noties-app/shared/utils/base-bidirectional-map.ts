import type { Id } from "#shared/types/app";

type Mode = "1to2" | "2to1";

export type TBaseBidirectionalMap<E1 extends { id: Id }, E2 extends { id: Id }> = BaseBidirectionalMap<E1, E2>;
export class BaseBidirectionalMap<E1 extends { id: Id }, E2 extends { id: Id }> {
  private map1To2 = new Map<string, E2>();
  private map2To1 = new Map<string, E1>();

  // ---- Key Builder ----
  protected _buildKey(id: Id, prefix?: string): string {
    return prefix ? `${prefix}:${id}` : String(id);
  }

  // ---- Getters ----
  getBy1(id: E1["id"], prefix?: string) {
    return this.map1To2.get(this._buildKey(id, prefix));
  }

  getBy2(id: E2["id"], prefix?: string) {
    return this.map2To1.get(this._buildKey(id, prefix));
  }

  // ---- Setters ----
  set(e1: E1, e2: E2, prefix?: string, mode: Mode | "both" = "both") {
    const key1 = this._buildKey(e1.id, prefix);
    const key2 = this._buildKey(e2.id, prefix);

    if (mode === "both" || mode === "1to2") {
      this.map1To2.set(key1, e2);
    }

    if (mode === "both" || mode === "2to1") {
      this.map2To1.set(key2, e1);
    }
  }

  setBy1(e1: E1, e2: E2, prefix?: string) {
    return this.set(e1, e2, prefix, "1to2");
  }

  setBy2(e2: E2, e1: E1, prefix?: string) {
    return this.set(e1, e2, prefix, "2to1");
  }

  // ---- Delete ----
  protected _delete(mode: "1to2", id: E1["id"], prefix?: string): void;
  protected _delete(mode: "2to1", id: E2["id"], prefix?: string): void;
  protected _delete(mode: Mode, id: Id, prefix?: string) {
    const key = this._buildKey(id, prefix);
    const { fromMap, toMap } = mode === "1to2"
      ? { fromMap: this.map1To2, toMap: this.map2To1 }
      : { fromMap: this.map2To1, toMap: this.map1To2 };

    const entity = fromMap.get(key);
    if (entity) {
      const entityKey = this._buildKey(entity.id, prefix);
      toMap.delete(entityKey);
    }

    fromMap.delete(key);
  }

  deleteBy1(id: E1["id"], prefix?: string) {
    this._delete("1to2", id, prefix);
  }

  deleteBy2(id: E2["id"], prefix?: string) {
    this._delete("2to1", id, prefix);
  }

  // ---- Clear ----
  clear(prefix?: string) {
    if (!prefix) {
      this.map1To2.clear();
      this.map2To1.clear();
      return;
    }

    const prefixKey = `${prefix}:`;
    for (const key of [...this.map1To2.keys()]) if (key.startsWith(prefixKey)) this.map1To2.delete(key);
    for (const key of [...this.map2To1.keys()]) if (key.startsWith(prefixKey)) this.map2To1.delete(key);
  }
}
