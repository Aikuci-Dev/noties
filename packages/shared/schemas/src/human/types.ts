import type * as FamilyTree from "./family-tree";
import type * as Simple from "./simple";

import { WithMetaSchema as DefaultSchema } from "./schemas";

/**
 * =========================
 * COLLECTIONS
 * =========================
 */
export type PersonMap<T extends PersonLike = DefaultSchema> = Map<PersonLike["id"], T>;
export type People<T extends PersonLike = DefaultSchema> = T[];

/**
 * =========================
 * KINDS
 * =========================
 */
export type PersonKind = Simple.Schema | FamilyTree.Schema;
export type PersonLike = DefaultSchema | PersonKind;
export type PersonWithChildrenLike = PersonKind;
