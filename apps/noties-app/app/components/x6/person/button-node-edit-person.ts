import type { Cell, Graph } from "@antv/x6";

export default function buttonNodeEditPerson({ handleClick }: { handleClick?: (data: NodePersonData) => void }) {
  const defaultAttrs = { fill: "none", stroke: "#000" };

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
        tagName: "circle",
        selector: "head",
        attrs: { ...defaultAttrs, cx: 8, cy: 4.8, r: 3 },
      },
      {
        tagName: "path",
        selector: "body",
        attrs: { ...defaultAttrs, d: "M3.2 12.6a4.8 4.8 0 0 1 6.493-4.492" },
      },
      {
        tagName: "path",
        selector: "edit",
        attrs: {
          ...defaultAttrs,
          d: "M12.827 9.376a1 1 0 0 0-1.8-1.8L8.621 9.984a1.2 1.2 0 0 0-.304.512l-.502 1.722a.3.3 0 0 0 .372.372l1.722-.502a1.2 1.2 0 0 0 .512-.304z",
        },
      },
    ],
  } satisfies Parameters<typeof Graph.registerNodeTool>[1];
}
