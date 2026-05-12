export const oxc = {
  oxfmt: {
    printWidth: 120,
    sortImports: {
      customGroups: [
        {
          groupName: "type-relaverse",
          modifiers: ["type"],
          elementNamePattern: ["@relaverse/*"],
        },
        {
          groupName: "value-relaverse",
          modifiers: ["value"],
          elementNamePattern: ["@relaverse/*"],
        },
      ],
      groups: [
        "type-import",
        ["value-builtin", "value-external"],

        "type-relaverse",
        "value-relaverse",

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
