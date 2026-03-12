import type { Graph } from "@antv/x6";

export default function nodePlaceholder(options: { radius?: number } = {}) {
  const { radius = 0 } = options;

  return {
    markup: [{ tagName: "circle", attrs: { class: "dot" } }],
    attrs: { ".dot": { r: radius } },
  } satisfies Parameters<typeof Graph.registerNode>[1];
}
