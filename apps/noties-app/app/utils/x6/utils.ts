import type { Node as X6Node } from "@antv/x6";

type BidirectionalNodeEntityMapInstance<Entity extends { id: Id }> = {
  set: (nodeType: NodeType, node: X6Node, entity: Entity) => void;
  getEntityByNodeId: (nodeId: X6Node["id"]) => Entity | undefined;
  getNodeByEntityId: (entityId: Entity["id"]) => X6Node | undefined;
  getEntityTypeByNodeId: (nodeId: X6Node["id"]) => NodeType | undefined;
};
class BidirectionalNodeEntityMap<Entity extends { id: Id }> {
  private nodeToEntityMap: Map<X6Node["id"], Entity> = new Map();
  private entityToNodeMap: Map<Entity["id"], X6Node> = new Map();
  private nodeTypeMap: Map<X6Node["id"], NodeType> = new Map();

  set(nodeType: NodeType, node: X6Node, entity: Entity) {
    this.nodeTypeMap.set(node.id, nodeType);
    this.nodeToEntityMap.set(node.id, entity);
    this.entityToNodeMap.set(entity.id, node);
  }

  getEntityByNodeId(nodeId: X6Node["id"]) {
    return this.nodeToEntityMap.get(nodeId);
  }

  getNodeByEntityId(entityId: Entity["id"]) {
    return this.entityToNodeMap.get(entityId);
  }

  getEntityTypeByNodeId(nodeId: X6Node["id"]) {
    return this.nodeTypeMap.get(nodeId);
  }
}

export { type BidirectionalNodeEntityMapInstance };
export { BidirectionalNodeEntityMap };
