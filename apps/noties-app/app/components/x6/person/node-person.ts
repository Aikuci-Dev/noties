import type { Graph } from "@antv/x6";

export default (dimension: Dimension) => {
  const { height, width } = dimension;

  return {
    height,
    width,
    markup: [
      { tagName: "rect", attrs: { class: "card" } },
      { tagName: "text", attrs: { class: "rank" } },
      { tagName: "text", attrs: { class: "name" } },
    ],
    attrs: {
      ".card": {
        rx: 10,
        ry: 10,
        fill: "#fff",
        refWidth: "100%",
        refHeight: "100%",
        strokeWidth: 1,
        pointerEvents: "visiblePainted",
      },
      ".rank": {
        refX: 0.5,
        refY: 0.1,
        fontFamily: "Courier New",
        fontSize: 10,
        textAnchor: "middle",
      },
      ".name": {
        refX: 0.5,
        refY: 0.5,
        fontFamily: "Arial",
        fontSize: 14,
        fontWeight: "600",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
  } satisfies Parameters<typeof Graph.registerNode>[1];
};
