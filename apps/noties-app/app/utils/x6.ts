export type { CellDep } from "./x6/layouts/index";
export type { FamilyTreeCellDep } from "./x6/layouts/family-tree";

export { default as simpleLayout } from "./x6/layouts/simple";
export { default as familyTreeLayout } from "./x6/layouts/family-tree";

/**
 * Internal exports — required to fully support Nuxt's auto-import mechanism.
 */
export { addAnimation, addInteraction, createGraphInstance, registerCells } from "./x6/index";
export { convertPersonToNodePerson } from "./x6/person";

export type {
  EdgePersonData,
  NodePersonData,
  NodePersonPlaceholderData,
  NodePersonRelationshipData,
} from "./x6/cells/person";
export {
  animateNodePerson,
  createEdgePerson,
  createNodePerson,
  createNodePersonPlaceholder,
  createNodePersonRelationship,
} from "./x6/cells/person";
