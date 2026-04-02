export const GENDER = ["M", "F"] as const;
export type Gender = typeof GENDER[number];
export type PersonParent = [number] | [number, number];
export type Person = {
  id: number;
  parentIds?: PersonParent | null;
  partnerId?: number | null;
  partnerIds?: number[] | null;
  childrenIds?: number[] | null;
  name: string;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  dateOfDeath?: string | null;
};
export type PersonMeta = {
  generationOrder?: number;
};
export type PersonWithMeta = Person & { meta: PersonMeta };
export type PersonMap<T extends Person | NodePerson = Person> = Map<T["id"], T>;
export type People<T extends Person & PersonMeta | NodePerson & NodePersonMeta = Person> = T[];
export type PeopleWithMeta<T extends PersonWithMeta | NodePersonWithMeta = PersonWithMeta> = T[];
export type PeopleByRank<T extends Person | NodePerson = Person> = { [rank: number]: People<T> };

export type PersonRelationship<T extends Person | NodePerson = Person> = {
  id: T["id"];
  partnerId: T["id"];
  partnerIds: T["id"][];
  childrenIds: T["id"][];
};
export type PersonRelationshipMap<T extends Person | NodePerson = Person> = Map<
  PersonRelationship<T>["id"],
  PersonRelationship<T>
>;
export type PersonRelationshipPartner<T extends Person | NodePerson = Person> = {
  id: EntityPairKey<T>;
  personId: T["id"];
  partnerId: T["id"];
  childrenIds: T["id"][];
};
export type PersonRelationshipPartnerMap<T extends Person | NodePerson = Person> = Map<
  PersonRelationshipPartner<T>["id"],
  PersonRelationshipPartner<T>
>;

/** ==== X6 ==== */
// X6 Node
const NODE_TYPE = ["PERSON", "PERSON_RELATIONSHIP"] as const;
export type NodeType = typeof NODE_TYPE[number];
export type NodePerson = Omit<Person, "name" | "dateOfBirth" | "dateOfDeath"> & {
  title: string;
  subtitle?: string;
  generationOrder?: number;
  isDead?: boolean;
  meta?: {
    original?: Person;
  };
};
export type NodePersonMeta = {
  isStack?: boolean;
};
export type NodePersonWithMeta = NodePerson & { meta: NodePersonMeta };
export type NodePersonData = { value: NodePerson; original: Person | PersonWithMeta; meta?: NodePersonMeta };

export const NODE_PLACEHOLDER = "node-placeholder";
export const NODE_INTERMEDIARY = "node-intermediary";
export const NODE_PERSON = "node-person";
export const NODE_PERSON_STACK = "node-person-stack";
export const NODE_PERSON_PLACEHOLDER = "node-person-placeholder";
export const NODE_PERSON_INTERMEDIARY = "node-person-intermediary";

export const BUTTON_NODE_EDIT_PERSON = "button-edit-person";

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
