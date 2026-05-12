import type { EntityPairKey } from "@/types/app";

import type { IdSchema as PersonId, Schema as PersonSchema } from "../schemas";

export type Relationship = {
  id: PersonId;
  partnerId: PersonId;
  partnerIds: PersonId[];
  childrenIds: PersonId[]; // across all partners
};
export type RelationshipMap = Map<Relationship["id"], Relationship>;

export type RelationshipPartner = {
  id: EntityPairKey<PersonSchema>;
  personId: PersonId;
  partnerId: PersonId;
  childrenIds: PersonId[]; // shared by this pair
};
export type RelationshipPartnerMap = Map<RelationshipPartner["id"], RelationshipPartner>;
