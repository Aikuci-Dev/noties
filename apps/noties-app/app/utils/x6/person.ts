import type { Graph } from "@antv/x6";
import { Dom } from "@antv/x6";

// Known minor Deno LSP bug: https://github.com/denoland/deno/issues/32549
// Issue: Nuxt AutoImports shared types are inferred as `any`, causing type safety loss.
import type { Nullable } from "~/utils/utils";
import type { Gender } from "~/utils/const";

export function createNodePerson(
  { graph, options }: {
    graph: Graph;
    options: { rank: string; name: string; gender?: Nullable<Gender>; isDead?: boolean; dimension: Dimension };
  },
) {
  const { rank, name, gender, isDead, dimension } = options;
  const { height, width } = dimension;

  return graph.createNode({
    shape: gender
      ? gender === "M"
        ? (isDead ? NODE_PERSON_MALE_DIE : NODE_PERSON_MALE)
        : (isDead ? NODE_PERSON_FEMALE_DIE : NODE_PERSON_FEMALE)
      : (isDead ? NODE_PERSON_DIE : NODE_PERSON),
    attrs: {
      ".rank": { text: Dom.breakText(rank, { height: height / 2, width }) },
      ".name": { text: Dom.breakText(name, { height: height / 2, width }) },
    },
  });
}
