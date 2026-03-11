import type { Graph } from "@antv/x6";
import { Dom, ObjectExt } from "@antv/x6";

export function resolveFillColor(options: { light?: boolean; gender?: Nullable<Gender>; isDead?: boolean }) {
  const { light, gender, isDead } = options;

  if (isDead) return light ? "#e5e7eb" : "#99a1af"; // Gray (200/400)
  if (gender === "M") return light ? "#bedbff" : "#51a2ff"; // Blue (200/400)
  if (gender === "F") return light ? "#fccee8" : "#fb64b6"; // Pink (200/400)
}

export default function nodePerson(options: { dimension: Dimension }) {
  const { dimension: { height, width } } = options;
  const radius = 8;

  function contentAttrs(isTop?: boolean) {
    return {
      clipPath: isTop ? "inset(0 0 49% 0)" : "inset(50% 0 0 0)",
      rx: radius,
      refX: "0%",
      refWidth: "0%",
      refHeight: "100%",
    };
  }
  function barAttrs(isTop?: boolean) {
    return {
      clipPath: isTop ? "inset(0 0 49% 0)" : "inset(50% 0 0 0)",
      d: "M 8 0 L 8 60 C 3.582 60 0 56.418 0 52 L 0 8 C 0 3.582 3.582 0 8 0 Z", // Created using Boxy SVG: https://boxy-svg.com/
    };
  }

  return {
    height,
    width,
    markup: [
      { tagName: "rect", attrs: { class: "card" } },
      { tagName: "rect", attrs: { class: "content" } },
      { tagName: "rect", attrs: { class: "content-t" } },
      { tagName: "rect", attrs: { class: "content-b" } },
      { tagName: "path", attrs: { class: "bar-t" } },
      { tagName: "path", attrs: { class: "bar-b" } },
      { tagName: "text", attrs: { class: "rank" } },
      { tagName: "text", attrs: { class: "name" } },
    ],
    attrs: {
      ".card": {
        // Defining either `rx` or `ry` is enough — the other will mirror the value.
        // https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/rx#rect
        rx: radius,
        refWidth: "100%",
        refHeight: "100%",
        fill: "#fff",

        filter: {
          name: "dropShadow",
          args: { dx: 4, dy: 4, blur: 4, opacity: 0.4 },
        },
      },
      ".content": {
        ref: ".card",
        refX: radius,
        refWidth: -2 * radius,
        refHeight: "100%",
        fill: "#fff",
      },
      ".content-t": contentAttrs(true),
      ".content-b": contentAttrs(),
      ".bar-t": barAttrs(true),
      ".bar-b": barAttrs(),
      ".rank": {
        refX: 0.5,
        refY: 0.05,
        fontFamily: "Courier New",
        fontSize: "0.5rem",
        fontWeight: "500",
        textAnchor: "middle",
      },
      ".name": {
        refX: 0.5,
        refY: 0.5,
        fontFamily: "Arial",
        fontSize: "1rem",
        fontWeight: "800",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
    },
    propHooks(metadata) {
      const { data, ...rest } = metadata;
      if (data) {
        const value: Person = data.value;
        const { name, rank, gender, isDead } = value;

        const textHeight = Math.min(Math.max(height / 2, 40), height);
        ObjectExt.setByPath(rest, "attrs/.rank/text", Dom.breakText(rank, { height: textHeight, width }));
        ObjectExt.setByPath(rest, "attrs/.name/text", Dom.breakText(name, { height: textHeight, width }));

        const genderOrMale = gender ?? "M";
        const genderOrFemale = gender ?? "F";
        ObjectExt.setByPath(rest, "attrs/.rank/fill", resolveFillColor({ gender, isDead }));
        ObjectExt.setByPath(rest, "attrs/.content-t/fill", resolveFillColor({ light: true, gender: genderOrMale }));
        ObjectExt.setByPath(rest, "attrs/.content-b/fill", resolveFillColor({ light: true, gender: genderOrFemale }));
        ObjectExt.setByPath(rest, "attrs/.bar-t/fill", resolveFillColor({ gender: genderOrMale, isDead }));
        ObjectExt.setByPath(rest, "attrs/.bar-b/fill", resolveFillColor({ gender: genderOrFemale, isDead }));
      }
      return rest;
    },
  } satisfies Parameters<typeof Graph.registerNode>[1];
}
