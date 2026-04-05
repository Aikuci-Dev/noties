import type { Node as X6Node } from "@antv/x6";

import type { Person, PersonId } from "@noties/shared-type";

import type { BaseEdgeMeta, NodeWithChildrenNodeMap } from "@/common/types";

import type { EdgePersonData, NodePersonData, NodePersonPlaceholderData, NodePersonRelationshipData } from "./x6";

/**
 * =========================
 * NODE
 * =========================
 */
// Entity
export type Node = Omit<Person, "name" | "dateOfBirth" | "dateOfDeath"> & {
  title: string;
  subtitle?: string;
  generationOrder?: number;
  isDead?: boolean;
  meta?: {
    original?: Person;
  };
};
export type NodeMeta = {
  isStack?: boolean;
};
export type NodeWithMeta = Node & { meta: NodeMeta };

// Collections
export type NodePersonMap = Map<PersonId, X6Node>;
export type NodePersonRelationshipMap = Map<string, X6Node>; // `relationship-${T['id']}`
export type NodePersonWithChildrenNodeMap = NodeWithChildrenNodeMap<PersonId>;

// DATA
const NODE_TYPE = ["PERSON", "PERSON_RELATIONSHIP"] as const;
export type NodeType = typeof NODE_TYPE[number];

export type NodeData =
  & { personType: NodeType }
  & (
    | { type: "NODE_PERSON" } & NodePersonData
    | { type: "NODE_PERSON_PLACEHOLDER" } & NodePersonPlaceholderData
    | { type: "NODE_PERSON_RELATIONSHIP" } & NodePersonRelationshipData
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
export type EdgeType = typeof EDGE_TYPE[number];

export type EdgeData = { personType: EdgeType } & { type: "EDGE_LINE" } & EdgePersonData;
