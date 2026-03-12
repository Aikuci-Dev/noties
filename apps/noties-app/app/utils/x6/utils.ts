import type { Node as X6Node } from "@antv/x6";

type BidirectionalNodeEntityMapInstance<Entity extends { id: Id }> = {
  set: (nodeType: NodeType, node: X6Node, entity: Entity) => void;
  getEntityByNodeId: (nodeType: NodeType, nodeId: X6Node["id"]) => Entity | undefined;
  getNodeByEntityId: (nodeType: NodeType, entityId: Entity["id"]) => X6Node | undefined;
};
class BidirectionalNodeEntityMap<Entity extends { id: Id }> {
  private nodeToEntityMap: Map<X6Node["id"], Entity> = new Map();
  private entityToNodeMap: Map<Entity["id"], X6Node> = new Map();

  set(nodeType: NodeType, node: X6Node, entity: Entity) {
    this.nodeToEntityMap.set(`${nodeType}-${node.id}`, entity);
    this.entityToNodeMap.set(`${nodeType}-${entity.id}`, node);
  }

  getEntityByNodeId(nodeType: NodeType, nodeId: X6Node["id"]) {
    return this.nodeToEntityMap.get(`${nodeType}-${nodeId}`);
  }

  getNodeByEntityId(nodeType: NodeType, entityId: Entity["id"]) {
    return this.entityToNodeMap.get(`${nodeType}-${entityId}`);
  }
}

export { type BidirectionalNodeEntityMapInstance };
export { BidirectionalNodeEntityMap };
