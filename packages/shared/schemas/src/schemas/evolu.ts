import { id, SqliteBoolean, nullOr, String100 } from "@evolu/common";
import { type EvoluSchema } from "@evolu/common";

import { familyTreeSchema } from "../human";

/** X6 */
const NodeId = id("Node");
type NodeId = typeof NodeId.Type;
const nodeSchema = {
  node: {
    id: NodeId,
    title: String100,
    subtitle: nullOr(String100),
  },
} satisfies EvoluSchema;

const NodeFamilyTreeId = id("NodeFamilyTree");
type NodeFamilyTreeId = typeof NodeFamilyTreeId.Type;
const nodeFamilyTreeSchema = {
  nodeFamilyTree: {
    id: NodeFamilyTreeId,
    NodeId: NodeId,
    // generationOrder: nullOr(Int),
    isAlive: nullOr(SqliteBoolean),
  },
} satisfies EvoluSchema;

export const EvoluDBSchema = { ...nodeSchema, ...nodeFamilyTreeSchema, ...familyTreeSchema } satisfies EvoluSchema;
