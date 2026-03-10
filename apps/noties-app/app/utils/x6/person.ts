import type { Graph, Node as X6Node } from "@antv/x6";
import { Dom } from "@antv/x6";

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

export function createNodePersonRelationship({ graph, data }: { graph: Graph; data: { nodes: X6Node[] } }) {
  return graph.createNode({ shape: NODE_PERSON_RELATIONSHIP, data });
}
