import type { CellDep, NodeDep, NodePersonWithChildrenNodeMap, NodeWithChildrenNodeDep } from "../types";

export const getNodesWithChildren = ({ nodePersonMap }: NodeDep) => ({ people }: CellDep) => {
  const nodeWithChildrenMap: NodePersonWithChildrenNodeMap = new Map();

  people.forEach((person) => {
    const node = nodePersonMap.get(person.id);
    if (!node) return;

    if (person.childrenIds) {
      const nodeChildren = person.childrenIds.flatMap((id) => {
        const nodeChild = nodePersonMap.get(id);
        if (!nodeChild) return [];
        return [nodeChild];
      });

      if (nodeChildren.length) nodeWithChildrenMap.set(person.id, { node, nodeChildren });
    }
  });

  return nodeWithChildrenMap;
};

export const setNodesRelationship = ({ nodesWithChildrenMap }: NodeWithChildrenNodeDep) => {
  // See: https://x6.antv.antgroup.com/en/api/model/cell#parentchildren-relationship
  nodesWithChildrenMap.values().forEach(({ node, nodeChildren }) => {
    nodeChildren.forEach((nodeChild) => nodeChild.setParent(node));
    node.setChildren(nodeChildren);
  });
};
