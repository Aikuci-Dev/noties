import * as v from "valibot";

import { PersonGenderSchema, PersonIdSchema, PersonMetaSchema, PersonSchema, PersonWithMetaSchema } from "../human";
import { EntityPairKey } from "./app";

/**
 * =========================
 * ENTITY
 * =========================
 */
export type PersonId = v.InferOutput<typeof PersonIdSchema>;
export type PersonGender = v.InferOutput<typeof PersonGenderSchema>;
export type Person = v.InferOutput<typeof PersonSchema>;
export type PersonMeta = v.InferOutput<typeof PersonMetaSchema>;
export type PersonWithMeta = v.InferOutput<typeof PersonWithMetaSchema>;

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
