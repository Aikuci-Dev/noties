import type { Graph } from "@antv/x6";

export function resolveFillColor(options: { light?: boolean; gender?: Nullable<Gender>; isDead?: boolean }) {
  const { light, gender, isDead } = options;

  if (isDead) return light ? "#e5e7eb" : "#99a1af"; // Gray (200/400)
  if (gender === "M") return light ? "#bedbff" : "#51a2ff"; // Blue (200/400)
  if (gender === "F") return light ? "#fccee8" : "#fb64b6"; // Pink (200/400)
}

function nodePerson(
  { data, options }: { data: { gender?: Nullable<Gender>; isDead?: boolean }; options: { dimension: Dimension } },
) {
  const { gender, isDead } = data;
  const { dimension: { height, width } } = options;

  const genderTop: Gender = gender ?? "M";
  const genderBottom: Gender = gender ?? "F";
  return {
    height,
    width,
    markup: [
      { tagName: "rect", attrs: { class: "card" } },
      { tagName: "rect", attrs: { class: "content" } },
      { tagName: "rect", attrs: { class: "content-animation-top" } },
      { tagName: "rect", attrs: { class: "content-animation-bottom" } },
      { tagName: "path", attrs: { class: "bar-top" } },
      { tagName: "path", attrs: { class: "bar-bottom" } },
      { tagName: "text", attrs: { class: "rank" } },
      { tagName: "text", attrs: { class: "name" } },
    ],
    attrs: {
      ".card": {
        rx: 5,
        ry: 5,
        refWidth: "100%",
        refHeight: "100%",
        fill: "#fff",

        filter: {
          name: "dropShadow",
          args: {
            dx: 4,
            dy: 4,
            blur: 4,
            opacity: 0.4,
          },
        },
      },
      ".content": {
        refX: "8%",
        refWidth: "84%",
        refHeight: "100%",
        fill: "#fff",
      },
      ".content-animation-top": {
        clipPath: "inset(0 0 49% 0)",
        rx: 5,
        ry: 5,
        refX: "0%",
        refWidth: "0%",
        refHeight: "100%",
        fill: resolveFillColor({ light: true, gender: genderTop }),
      },
      ".content-animation-bottom": {
        clipPath: "inset(50% 0 0 0)",
        rx: 5,
        ry: 5,
        refX: "0%",
        refWidth: "0%",
        refHeight: "100%",
        fill: resolveFillColor({ light: true, gender: genderBottom }),
      },
      ".bar-top": {
        clipPath: "inset(0 0 49% 0)",
        d: "M 5 0 L 5 60 C 2.239 60 0 58.321 0 56.25 L 0 3.75 C 0 1.679 2.239 0 5 0 Z", // Created using Boxy SVG: https://boxy-svg.com/
        fill: resolveFillColor({ gender: genderTop, isDead }),
      },
      ".bar-bottom": {
        clipPath: "inset(50% 0 0 0)",
        d: "M 5 0 L 5 60 C 2.239 60 0 58.321 0 56.25 L 0 3.75 C 0 1.679 2.239 0 5 0 Z", // Created using Boxy SVG: https://boxy-svg.com/
        fill: resolveFillColor({ gender: genderBottom, isDead }),
      },
      ".rank": {
        refX: 0.5,
        refY: 0.1,
        fontFamily: "Courier New",
        fontSize: 8,
        fontWeight: "500",
        textAnchor: "middle",
        fill: resolveFillColor({ gender, isDead }),
      },
      ".name": {
        refX: 0.5,
        refY: 0.5,
        fontFamily: "Arial",
        fontSize: 12,
        fontWeight: "800",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
  } satisfies Parameters<typeof Graph.registerNode>[1];
}

function nodePersonRelationship() {
  return {
    markup: [{ tagName: "circle", attrs: { class: "dot" } }],
    attrs: { ".dot": { r: 2 } } satisfies Parameters<typeof Graph.registerNode>[1],
  };
}

export { nodePerson, nodePersonRelationship };
