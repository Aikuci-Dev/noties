// Common
export type Id = string | number;
export type EntityPairKey<T extends { id: Id }> = `${T["id"]}-${T["id"]}`;

// Person
export const GENDER = ["M", "F"] as const;
export type Gender = typeof GENDER[number];
export const RELATIONSHIP = ["parent", "children", "partner"] as const;
export type Relationship = typeof RELATIONSHIP[number];
export type Person = {
  id: number;
  // parent?: [number] | [number, number]; // TODO: Support single-parent source
  // partner?: number[]; // TODO: support multiple spouses
  parent?: [number, number];
  partner?: number;
  children?: number[];
  rank: string;
  name: string;
  gender?: Gender;
  isDead?: boolean;
};
export type PeopleRelationship = {
  id: string;
  person?: Person["id"];
  people: Person["id"][];
  type: Relationship;
};

// X6
export const NODE_PERSON = "node-person";
export const NODE_PERSON_MALE = "node-person-male";
export const NODE_PERSON_FEMALE = "node-person-female";
export const NODE_PERSON_DIE = "node-person-die";
export const NODE_PERSON_MALE_DIE = "node-person-male-die";
export const NODE_PERSON_FEMALE_DIE = "node-person-female-die";
export const NODE_PERSON_RELATIONSHIP = "node-person-relationship";
export const EDGE_LINE = "edge-line";
export const EDGE_LINE_RELATIONSHIP = "edge-line-relationship";
export const NODE_TYPE = ["PERSON", "PERSON_RELATIONSHIP"] as const;
export type NodeType = typeof NODE_TYPE[number];
export type Dimension = { width: number; height: number };

// Dagre
export const DAGRE_RANKDIRS = ["LR", "RL", "TB", "BT"] as const;
export type DagreRankdir = typeof DAGRE_RANKDIRS[number];
