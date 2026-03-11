import type { Graph } from "@antv/x6";

export default function nodePlaceholder({ radius }: { radius: number }) {
  return {
    markup: [{ tagName: "circle", attrs: { class: "dot" } }],
    attrs: { ".dot": { r: radius } } satisfies Parameters<typeof Graph.registerNode>[1],
  };
}
