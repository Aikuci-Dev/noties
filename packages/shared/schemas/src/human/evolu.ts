import { DateIso, NonEmptyTrimmedString100, array, id, nullOr, union } from "@evolu/common";
import { type EvoluSchema } from "@evolu/common";

import { PERSON_GENDERS } from "./person";

const FamilyTreeId = id("FamilyTree");
type FamilyTreeId = typeof FamilyTreeId.Type;

const HumanGender = union(...PERSON_GENDERS);
type HumanGender = typeof HumanGender.Type;

export const familyTreeSchema = {
  familyTree: {
    id: FamilyTreeId,
    parentIds: nullOr(array(FamilyTreeId)),
    partnerIds: nullOr(array(FamilyTreeId)),
    childrenIds: nullOr(array(FamilyTreeId)),

    name: NonEmptyTrimmedString100,
    gender: nullOr(HumanGender),
    dateOfBirth: nullOr(DateIso),
    dateOfDeath: nullOr(DateIso),
  },
} satisfies EvoluSchema;
