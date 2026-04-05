import type { Brand } from "valibot";

import type { EntityId, EntityPairKey } from "../common";

/**
 * =========================
 * PROPERTIES
 * =========================
 */
export type PersonId = EntityId<number> & Brand<"PersonId">;

export const GENDER = ["M", "F"] as const;
export type Gender = typeof GENDER[number];

export type PersonParent = [PersonId] | [PersonId, PersonId];

/**
 * =========================
 * ENTITY
 * =========================
 */
export type Person = {
  id: PersonId;

  parentIds?: PersonParent | null;
  partnerIds?: PersonId[] | null;
  childrenIds?: PersonId[] | null;

  name: string;

  gender?: Gender | null;
  dateOfBirth?: string | null;
  dateOfDeath?: string | null;
};
export type PersonMeta = {
  partnerId?: PersonId; // Current Partner
  generationOrder?: number;
};
export type PersonWithMeta = Person & { meta: PersonMeta };

/**
 * =========================
 * COLLECTIONS
 * =========================
 */
export type PersonMap = Map<PersonId, Person>;

export type People<T extends Person | PersonWithMeta = Person> = T[];

/**
 * =========================
 * RELATIONSHIPS
 * =========================
 */
export type PersonRelationship = {
  id: PersonId;
  partnerId: PersonId;
  partnerIds: PersonId[];
  childrenIds: PersonId[]; // across all partners
};
export type PersonRelationshipMap = Map<PersonRelationship["id"], PersonRelationship>;

export type PersonRelationshipPartner = {
  id: EntityPairKey<Person>;
  personId: PersonId;
  partnerId: PersonId;
  childrenIds: PersonId[]; // shared by this pair
};
export type PersonRelationshipPartnerMap = Map<PersonRelationshipPartner["id"], PersonRelationshipPartner>;
