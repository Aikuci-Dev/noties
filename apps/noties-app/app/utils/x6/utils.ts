import type { Node } from "@antv/x6";

class BidirectionalNodeEntityMap<Entity extends { id: Id }> {
  private nodeToEntityMap: Map<Node["id"], Entity> = new Map();
  private entityToNodeMap: Map<Entity["id"], Node> = new Map();

  add(node: Node, entity: Entity) {
    this.nodeToEntityMap.set(node.id, entity);
    this.entityToNodeMap.set(entity.id, node);
  }

  getPersonByNodeId(nodeId: Node["id"]) {
    return this.nodeToEntityMap.get(nodeId);
  }

  getNodeByPersonId(entityId: Entity["id"]) {
    return this.entityToNodeMap.get(entityId);
  }
}

export { BidirectionalNodeEntityMap };
