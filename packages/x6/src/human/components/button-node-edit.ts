import type { Cell, Graph } from "@antv/x6";

import type { NodePersonData } from "../types";

export const BUTTON_NODE_EDIT = "button-node-edit-person";

export default function nodeTool({ handleClick }: { handleClick?: (data: NodePersonData) => void }) {
  return {
    inherit: "button",
    onClick({ cell }: { cell: Cell }) {
      handleClick?.(cell.data);
    },
    x: "100%",
    y: 0,
    offset: { x: -20, y: 4 },
    markup: [
      {
        tagName: "circle",
        selector: "button",
        attrs: {
          r: 8,
          cx: 8,
          cy: 8,
          fill: "#facc15", // yellow-400
          cursor: "pointer",
        },
      },
      {
        tagName: "image",
        selector: "icon",
        attrs: {
          "xlink:href": "https://api.iconify.design/lucide:user-pen.svg",
          cursor: "pointer",
        },
      },
    ],
  } satisfies Parameters<typeof Graph.registerNodeTool>[1];
}
