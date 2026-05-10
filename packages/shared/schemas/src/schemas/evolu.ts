import { id, SqliteBoolean, nullOr, String100 } from "@evolu/common";
import { type EvoluSchema } from "@evolu/common";

import * as human from "@/human/evolu";

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

const NodeHumanSimpleId = id("NodeHumanSimple");
type NodeHumanSimpleId = typeof NodeHumanSimpleId.Type;
const nodeHumanSimpleSchema = {
  nodeHumanSimple: {
    id: NodeHumanSimpleId,
    NodeId: NodeId,
  },
} satisfies EvoluSchema;

const NodeHumanFamilyTreeId = id("NodeHumanFamilyTree");
type NodeHumanFamilyTreeId = typeof NodeHumanFamilyTreeId.Type;
const nodeHumanFamilyTreeSchema = {
  nodeHumanFamilyTree: {
    id: NodeHumanFamilyTreeId,
    NodeId: NodeId,
    // generationOrder: nullOr(Int), // Should `generationOrder` be stored in the DB? I think it’s runtime-only and may differ depending on the chart rendering scope.
    isAlive: nullOr(SqliteBoolean),
  },
} satisfies EvoluSchema;

export const EvoluDBSchema = {
  ...nodeSchema,

  ...nodeHumanSimpleSchema,
  ...human.SimpleEvoluSchema,

  ...nodeHumanFamilyTreeSchema,
  ...human.FamilyTreeEvoluSchema,
} satisfies EvoluSchema;
