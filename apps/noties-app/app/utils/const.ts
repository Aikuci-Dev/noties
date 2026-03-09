// Common
export type Id = string | number;

// Person
export const GENDER = ["M", "F"] as const;
export type Gender = typeof GENDER[number];
export type Person = {
  id: number;
  parent?: number[];
  children?: number[];
  rank: string;
  name: string;
  gender?: Gender;
  isDead?: boolean;
};

// X6
export const NODE_PERSON = "node-person";
export const NODE_PERSON_MALE = "node-person-male";
export const NODE_PERSON_FEMALE = "node-person-female";
export const NODE_PERSON_DIE = "node-person-die";
export const NODE_PERSON_MALE_DIE = "node-person-male-die";
export const NODE_PERSON_FEMALE_DIE = "node-person-female-die";
export const EDGE_LINE = "edge-line";
export type Dimension = { width: number; height: number };

// Dagre
export const DAGRE_RANKDIRS = ["LR", "RL", "TB", "BT"] as const;
export type DagreRankdir = typeof DAGRE_RANKDIRS[number];
