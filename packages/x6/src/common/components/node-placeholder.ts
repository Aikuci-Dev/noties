import type { Graph } from "@antv/x6";

export const NODE_PLACEHOLDER = "node-placeholder";
export const NODE_INTERMEDIARY = "node-intermediary";

export default function node(options: { radius?: number } = {}) {
  const { radius = 0 } = options;

  return {
    markup: [{ tagName: "circle", attrs: { class: "dot" } }],
    attrs: { ".dot": { r: radius } },
  } satisfies Parameters<typeof Graph.registerNode>[1];
}
