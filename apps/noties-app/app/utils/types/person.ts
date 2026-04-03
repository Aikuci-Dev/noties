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

export type PersonMap<T extends Person | PersonNode = Person> = Map<T["id"], T>;
export type PersonRelationship<T extends Person | PersonNode = Person> = {
  id: T["id"];
  partnerId: T["id"];
  partnerIds: T["id"][];
  childrenIds: T["id"][];
};
export type PersonRelationshipMap<T extends Person | PersonNode = Person> = Map<
  PersonRelationship<T>["id"],
  PersonRelationship<T>
>;
export type PersonRelationshipPartner<T extends Person | PersonNode = Person> = {
  id: EntityPairKey<T>;
  personId: T["id"];
  partnerId: T["id"];
  childrenIds: T["id"][];
};
export type PersonRelationshipPartnerMap<T extends Person | PersonNode = Person> = Map<
  PersonRelationshipPartner<T>["id"],
  PersonRelationshipPartner<T>
>;

export type People<T extends Person | PersonNode = Person> = T[];
export type PeopleWithMeta<T extends PersonWithMeta | PersonNodeWithMeta = PersonWithMeta> = T[];
export type PeopleByRank<T extends Person | PersonNode = Person> = { [rank: number]: People<T> };

/** ==== X6 ==== */
// X6 Cell
export type PersonCellData = PersonNodeData | PersonEdgeData;
export type PersonNodeData =
  & { personType: AllowedPersonNodeType }
  & (
    | { type: "NODE_PERSON" } & NodePersonData
    | { type: "NODE_PERSON_RELATIONSHIP" } & NodePersonRelationshipData
    | { type: "NODE_PERSON_PLACEHOLDER" } & NodePersonPlaceholderData
  );
export type PersonEdgeData =
  & { personType: AllowedPersonEdgeType }
  & { type: "EDGE_LINE" }
  & EdgePersonData;

// X6 Node
export const NODE_PERSON = "node-person";
export const NODE_PERSON_STACK = "node-person-stack";
export const NODE_PERSON_PLACEHOLDER = "node-person-placeholder";
export const NODE_PERSON_INTERMEDIARY = "node-person-intermediary";

export const BUTTON_NODE_EDIT_PERSON = "button-edit-person";

const PERSON_NODE_TYPE = ["PERSON", "PERSON_RELATIONSHIP"] as const;
export type PersonNodeType = typeof PERSON_NODE_TYPE[number];
export type AllowedPersonNodeType = PersonNodeType;

export type PersonNode = Omit<Person, "name" | "dateOfBirth" | "dateOfDeath"> & {
  title: string;
  subtitle?: string;
  generationOrder?: number;
  isDead?: boolean;
  meta?: {
    original?: Person;
  };
};
export type PersonNodeMeta = {
  isStack?: boolean;
};
export type PersonNodeWithMeta = PersonNode & { meta: PersonNodeMeta };

// X6 Edge
const PERSON_EDGE_TYPE = ["PERSON", "PARTNER"] as const;
export type PersonEdgeType = typeof PERSON_EDGE_TYPE[number];
export type AllowedPersonEdgeType = PersonEdgeType;

export type PersonEdgeMeta = BaseEdgeMeta & {
  isPlaceholder?: boolean;
  hasPartner?: boolean;
  isChildOfCurrentMarriage?: boolean;
};
