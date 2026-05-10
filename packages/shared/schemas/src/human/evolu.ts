import { SqliteBoolean, NonEmptyTrimmedString100, id, nullOr, union, DateIso, PositiveInt } from "@evolu/common";
import { type EvoluSchema } from "@evolu/common";

import type { KindSchema } from "@/human/schemas";

import { GENDERS } from "./schemas";

const HumanGender = union(...GENDERS);
type HumanGender = typeof HumanGender.Type;

type BasePersonSchema<T> = {
  id: T;
  name: typeof NonEmptyTrimmedString100;
  gender: ReturnType<typeof nullOr<typeof HumanGender>>;
};

type SimplePersonSchema<T> = BasePersonSchema<T> & {
  isAccent: ReturnType<typeof nullOr<typeof SqliteBoolean>>;
};

type FamilyTreePersonSchema<T> = BasePersonSchema<T> & {
  dateOfBirth: ReturnType<typeof nullOr<typeof DateIso>>;
  dateOfBirthTs: ReturnType<typeof nullOr<typeof PositiveInt>>;
  dateOfDeath: ReturnType<typeof nullOr<typeof DateIso>>;
  dateOfDeathTs: ReturnType<typeof nullOr<typeof PositiveInt>>;
};

type PersonSchemaMap<T> = {
  Simple: SimplePersonSchema<T>;
  FamilyTree: FamilyTreePersonSchema<T>;
};

type PersonSchemaByKind<T, K extends keyof PersonSchemaMap<T>> = PersonSchemaMap<T>[K];

const generateBasePersonSchema = <T, K extends KindSchema>(id: T, { kind }: { kind: K }): PersonSchemaByKind<T, K> => {
  const base = {
    id,
    name: NonEmptyTrimmedString100,
    gender: nullOr(HumanGender),
  };

  switch (kind) {
    case "Simple":
      return {
        ...base,
        isAccent: nullOr(SqliteBoolean),
      } as PersonSchemaByKind<T, K>;

    case "FamilyTree":
      return {
        ...base,
        dateOfBirth: nullOr(DateIso),
        dateOfBirthTs: nullOr(PositiveInt),
        dateOfDeath: nullOr(DateIso),
        dateOfDeathTs: nullOr(PositiveInt),
      } as PersonSchemaByKind<T, K>;

    default:
      throw new Error(`Invalid person kind: ${kind satisfies never}`);
  }
};

const generatePersonParentChildSchema = <T1, T2>(id: T1, idSecondary?: T2) => ({
  id,
  parentId: idSecondary ?? id,
  childId: idSecondary ?? id,
});

const generatePersonPartnerSchema = <T1, T2>(id: T1, idSecondary?: T2) => ({
  id,
  personId: idSecondary ?? id,
  partnerId: idSecondary ?? id,
});

/**
 * =========================
 * SIMPLE
 * =========================
 */
const SimpleId = id("Simple");
type SimpleId = typeof SimpleId.Type;

const SimpleParentChildId = id("SimpleParentChild");
type SimpleParentChildId = typeof SimpleParentChildId.Type;

export const SimpleEvoluSchema = {
  simple: generateBasePersonSchema(SimpleId, { kind: "Simple" }),
  simpleParentChild: generatePersonParentChildSchema(SimpleParentChildId, SimpleId),
} satisfies EvoluSchema;

/**
 * =========================
 * FAMILY TREE
 * =========================
 */
const FamilyTreeId = id("FamilyTree");
type FamilyTreeId = typeof FamilyTreeId.Type;

const FamilyTreeParentChildId = id("FamilyTreeParentChild");
type FamilyTreeParentChildId = typeof FamilyTreeParentChildId.Type;

const FamilyTreePartnerId = id("FamilyTreePartner");
type FamilyTreePartnerId = typeof FamilyTreePartnerId.Type;

export const FamilyTreeEvoluSchema = {
  familyTree: generateBasePersonSchema(FamilyTreeId, { kind: "FamilyTree" }),
  familyTreeParentChild: generatePersonParentChildSchema(FamilyTreeParentChildId, FamilyTreeId),
  familyTreePartner: generatePersonPartnerSchema(FamilyTreePartnerId, FamilyTreeId),
} satisfies EvoluSchema;
