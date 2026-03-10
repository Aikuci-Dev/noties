import type { Graph, Node as X6Node } from "@antv/x6";

export function createNodePerson({ graph, data }: { graph: Graph; data: Person }) {
  return graph.createNode({
    shape: NODE_PERSON,
    data: { cellType: "NODE", type: "PERSON", value: data } satisfies CellData,
  });
}

export function createNodePersonRelationship({ graph, data }: { graph: Graph; data: { nodes: X6Node[] } }) {
  return graph.createNode({
    shape: NODE_PERSON_RELATIONSHIP,
    data: { cellType: "NODE", type: "PERSON_RELATIONSHIP", value: data } satisfies CellData,
  });
}

export function animateNodePerson(node: X6Node, options: { fill?: boolean } = {}) {
  const targetWidth = options.fill ? "100%" : "0%";

  node.animate({ "attrs/.content-t/refWidth": targetWidth }, { duration: 1000, iterations: 1 });
  node.on("animation:finish", () => node.attr(".content-t/refWidth", targetWidth));
  node.animate({ "attrs/.content-b/refWidth": targetWidth }, { duration: 1000, iterations: 1 });
  node.on("animation:finish", () => node.attr(".content-b/refWidth", targetWidth));
}
