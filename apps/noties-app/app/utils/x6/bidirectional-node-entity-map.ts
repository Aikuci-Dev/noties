import type { Node as X6Node } from "@antv/x6";

export type TBidirectionalNodeEntityMap<Entity extends { id: Id }> = BidirectionalNodeEntityMap<Entity>;
export class BidirectionalNodeEntityMap<Entity extends { id: Id }> {
  private map = new BaseBidirectionalMap<X6Node, Entity>();

  set(nodeType: NodeType, node: X6Node, entity: Entity) {
    this.map.set(node, entity, nodeType);
  }

  getNode(nodeType: NodeType, entityId: Entity["id"]) {
    return this.map.getBy2(entityId, nodeType);
  }

  getEntity(nodeType: NodeType, nodeId: X6Node["id"]) {
    return this.map.getBy1(nodeId, nodeType);
  }
}
