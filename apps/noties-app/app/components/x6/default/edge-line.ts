import type { Graph } from "@antv/x6";

export default {
  zIndex: -1,
  attrs: {
    line: {
      strokeWidth: 2,
      stroke: "#A2B1C3",
      sourceMarker: null,
      targetMarker: null,
    },
  },
} satisfies Parameters<typeof Graph.registerEdge>[1];
