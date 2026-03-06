import type { Graph } from "@antv/x6";
import { Dom } from "@antv/x6";

export function createNodePerson(
  { graph, options }: { graph: Graph; options: { rank: string; name: string; dimension: Dimension } },
) {
  const { rank, name, dimension } = options;
  const { height, width } = dimension;

  return graph.createNode({
    shape: NODE_PERSON,
    attrs: {
      ".rank": { text: Dom.breakText(rank, { height: height / 2, width }) },
      ".name": { text: Dom.breakText(name, { height: height / 2, width }) },
    },
  });
}
