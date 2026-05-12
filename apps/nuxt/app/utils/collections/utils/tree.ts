import type { Id, Nullish } from "@relaverse/shared-schema";

import { isEmpty } from "@relaverse/shared-util";

export function collectTree<T extends { id: Id; childrenIds?: Nullish<Id[]> }>(
  items: T[],
  { rootId }: { rootId?: Nullish<Id> } = {},
): T[] {
  const map = new Map(items.map((item) => [item.id, item]));

  const result: T[] = [];
  const visited = new Set<Id>();

  function walk(id: Nullish<Id>) {
    if (id == null) return;

    if (visited.has(id)) return;
    visited.add(id);

    const item = map.get(id);
    if (!item) return;

    result.push(item);

    if (item.childrenIds?.length) for (const childId of item.childrenIds) walk(childId);
  }

  const detectedRootId = rootId ?? items.find((item) => item.childrenIds?.length)?.id ?? items[0]?.id;
  if (!isEmpty(detectedRootId)) walk(detectedRootId);

  return result;
}
