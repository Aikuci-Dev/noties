import type { Node as X6Node } from "@antv/x6";

export type TBidirectionalNodeEntityMap<Entity extends { id: Id }> = BidirectionalNodeEntityMap<Entity>;
export class BidirectionalNodeEntityMap<Entity extends { id: Id }> {
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
