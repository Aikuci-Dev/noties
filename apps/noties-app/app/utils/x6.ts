export type { CellDep } from "./x6/layouts/index";
export type { FamilyTreeCellDep } from "./x6/layouts/family-tree";

export { default as simpleLayout } from "./x6/layouts/simple";
export { default as familyTreeLayout } from "./x6/layouts/family-tree";

/**
 * Internal exports — required to fully support Nuxt's auto-import mechanism.
 */
export type { TBidirectionalNodeEntityMap } from "./x6/utils";

export { animation, graphInstance, registration } from "./x6/index";
export { BidirectionalNodeEntityMap } from "./x6/utils";

export { createEdgeLine } from "./x6/cells/default";
export {
  animateNodePerson,
  createNodePerson,
  createNodePersonPlaceholder,
  createNodePersonRelationship,
} from "./x6/cells/person";
