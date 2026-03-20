const GENDER = ["M", "F"] as const;
export type Gender = typeof GENDER[number];
export type Person = {
  id: number;
  generationOrder?: number;
  parentIds?: [number] | [number, number];
  partnerId?: number;
  partnerIds?: number[];
  childrenIds?: number[];
  subtitle?: string;
  title: string;
  gender?: Gender;
  isDead?: boolean;
};
export type PersonMap = Map<Person["id"], Person>;

export type People = Person[];
export type PeopleByRank = { [rank: number]: People };

export type PersonRelationship = {
  id: Person["id"];
  partnerId: Person["id"];
  partnerIds: Person["id"][];
  childrenIds: Person["id"][];
};
export type PersonRelationshipMap = Map<PersonRelationship["id"], PersonRelationship>;
export type PersonRelationshipPartner = {
  id: EntityPairKey<Person>;
  personId: Person["id"];
  partnerId: Person["id"];
  childrenIds: Person["id"][];
};
export type PersonRelationshipPartnerMap = Map<PersonRelationshipPartner["id"], PersonRelationshipPartner>;

/** ==== X6 ==== */
// X6 Node
const NODE_TYPE = ["PERSON", "PERSON_RELATIONSHIP"] as const;
export type NodeType = typeof NODE_TYPE[number];
export type NodePersonMeta = { isStack?: boolean };

export const NODE_PLACEHOLDER = "node-placeholder";
export const NODE_INTERMEDIARY = "node-intermediary";
export const NODE_PERSON = "node-person";
export const NODE_PERSON_STACK = "node-person-stack";
export const NODE_PERSON_PLACEHOLDER = "node-person-placeholder";
export const NODE_PERSON_INTERMEDIARY = "node-person-intermediary";

// X6 Edge
const EDGE_TYPE = ["LINE", "PARTNER"] as const;
export type EdgeType = typeof EDGE_TYPE[number];
export type EdgeLineMeta = {
  isDash?: boolean;
  isPlaceholder?: boolean;
  hasPartner?: boolean;
  isChildOfCurrentMarriage?: boolean;
};

export const EDGE_LINE = "edge-line";
export const EDGE_LINE_DASH = "edge-line-dash";

// X6 Cell
export type PersonCellData<TMeta = unknown> = CellData<NodeType, EdgeType, TMeta>;
