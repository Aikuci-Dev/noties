import type { Graph } from "@antv/x6";

export const EDGE_LINE = "edge-line";
export const EDGE_LINE_DASH = "edge-line-dash";

export default function edge(options: { isDash?: boolean } = {}) {
  const { isDash } = options;

  return {
    zIndex: -1,
    attrs: {
      line: {
        strokeWidth: 2,
        stroke: "#A2B1C3",
        ...(isDash && { strokeDasharray: 5 }),
        sourceMarker: null,
        targetMarker: null,
      },
    },
  } satisfies Parameters<typeof Graph.registerEdge>[1];
}
