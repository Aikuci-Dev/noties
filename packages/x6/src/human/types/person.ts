import type { Node as X6Node } from "@antv/x6";

import type { EntityId, Human, Nullish } from "@noties/shared-schema";

import type { BaseEdgeMeta, NodeWithChildrenNodeMap } from "@/common/types";

import type { EdgePersonData, NodePersonData, NodePersonPlaceholderData, NodePersonRelationshipData } from "./x6";

export type PersonSchema = Human.WithMetaSchema;

/**
 * =========================
 * NODE
 * =========================
 */
// Entity
export type Node = {
  id: EntityId<Human.PersonLike["id"]>;
  title: string;
  subtitle?: string;
  gender?: Nullish<Human.GenderSchema>;
  isAccent?: boolean;
  // generationOrder?: number;
  meta?: {
    original?: Human.PersonLike;
  };
};
export type NodeMeta = {
  isStack?: boolean;
};
export type NodeWithMeta = Node & { meta: NodeMeta };

// Collections
export type NodePersonMap<T extends Human.PersonLike = PersonSchema> = Map<T["id"], X6Node>;
export type NodePersonRelationshipMap = Map<
  `relationship-${Human.FamilyTree.Relationship["id"] | Human.FamilyTree.RelationshipPartner["id"]}`,
  X6Node
>; // `relationship-${T['id']}`
export type NodePersonWithChildrenNodeMap<T extends Human.PersonWithChildrenLike = Human.Simple.Schema> =
  NodeWithChildrenNodeMap<T["id"]>;

// DATA
const NODE_TYPE = ["PERSON", "PERSON_RELATIONSHIP"] as const;
export type NodeType = (typeof NODE_TYPE)[number];

export type NodeData = { personType: NodeType } & (
  | ({ type: "NODE_PERSON" } & NodePersonData)
  | ({ type: "NODE_PERSON_PLACEHOLDER" } & NodePersonPlaceholderData)
  | ({ type: "NODE_PERSON_RELATIONSHIP" } & NodePersonRelationshipData)
);

/**
 * =========================
 * EDGE
 * =========================
 */
// Entity
export type EdgeMeta = BaseEdgeMeta & {
  isPlaceholder?: boolean;
  hasPartner?: boolean;
  isChildOfCurrentMarriage?: boolean;
};

// DATA
const EDGE_TYPE = ["PERSON", "PARTNER"] as const;
export type EdgeType = (typeof EDGE_TYPE)[number];

export type EdgeData = { personType: EdgeType } & { type: "EDGE_LINE" } & EdgePersonData;
