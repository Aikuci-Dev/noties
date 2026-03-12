// App
export type Id = string | number;
export type EntityPairKey<T extends { id: Id }> = `${T["id"]}-${T["id"]}`;

// Person
export const GENDER = ["M", "F"] as const;
export type Gender = typeof GENDER[number];
export type Person = {
  id: number;
  parent?: [number] | [number, number];
  partner?: number;
  partners?: number[];
  children?: number[];
  subtitle?: string;
  title: string;
  gender?: Gender;
  isDead?: boolean;
};
export type PeopleByRank = { [rank: number]: Person[] };
export type PeopleByGeneration = PeopleByRank;
export type PersonPartner = {
  id: EntityPairKey<Person>;
  person: Person["id"];
  partner: Person["id"];
  children?: Person["id"][];
};
export type PersonPartnerMap = Map<PersonPartner["id"], PersonPartner>;

// X6
export type Dimension = { width: number; height: number };
export type CellData<TMeta = unknown> =
  | { cellType: "NODE"; type: NodeType; value: unknown; meta?: TMeta }
  | { cellType: "EDGE"; type: EdgeType; value: unknown; meta?: TMeta };

export const NODE_TYPE = ["PERSON", "PERSON_RELATIONSHIP"] as const;
export type NodeType = typeof NODE_TYPE[number];
export const NODE_PLACEHOLDER = "node-placeholder";
export const NODE_INTERMEDIARY = "node-intermediary";
export const NODE_PERSON = "node-person";
export const NODE_PERSON_STACK = "node-person-stack";
export const NODE_PERSON_PLACEHOLDER = "node-person-placeholder";
export const NODE_PERSON_INTERMEDIARY = "node-person-intermediary";
export type NodePersonMeta = { isStack?: boolean };

export const EDGE_TYPE = ["LINE", "PARTNER"] as const;
export type EdgeType = typeof EDGE_TYPE[number];
export const EDGE_LINE = "edge-line";
export const EDGE_LINE_DASH = "edge-line-dash";
export type EdgeLineMeta = { isDash?: boolean; isPlaceholder?: boolean; isChildOfCurrentMarriage?: boolean };

// Dagre
export const DAGRE_RANKDIRS = ["LR", "RL", "TB", "BT"] as const;
export type DagreRankdir = typeof DAGRE_RANKDIRS[number];
