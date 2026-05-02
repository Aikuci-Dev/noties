export const oxc = {
  oxfmt: {
    printWidth: 120,
    sortImports: {
      customGroups: [
        {
          groupName: "type-noties",
          modifiers: ["type"],
          elementNamePattern: ["@noties/*"],
        },
        {
          groupName: "value-noties",
          modifiers: ["value"],
          elementNamePattern: ["@noties/*"],
        },
      ],
      groups: [
        "type-import",
        ["value-builtin", "value-external"],

        "type-noties",
        "value-noties",

        "type-internal",
        "value-internal",
        ["type-parent", "type-sibling", "type-index"],
        ["value-parent", "value-sibling", "value-index"],
        // "ts-equals-import",
        "unknown",
      ],
    },
    sortPackageJson: {
      sortScripts: true,
    },
  },
};
