import type { Graph } from "@antv/x6";
import { ObjectExt } from "@antv/x6";

export function resolveFillColor(options: { light?: boolean; gender?: Nullable<Gender>; isDead?: boolean }) {
  const { light, gender, isDead } = options;

  if (isDead) return light ? "#e5e7eb" : "#99a1af"; // Gray (200/400)
  if (gender === "M") return light ? "#bedbff" : "#51a2ff"; // Blue (200/400)
  if (gender === "F") return light ? "#fccee8" : "#fb64b6"; // Pink (200/400)
}

export default function nodePerson(options: { dimension: Dimension; isStack?: boolean }) {
  const { dimension: { height, width }, isStack } = options;
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
  function cardAttrs(withFilter?: boolean) {
    return {
      // Defining either `rx` or `ry` is enough — the other will mirror the value.
      // https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/rx#rect
      rx: radius,
      refWidth: "100%",
      refHeight: "100%",
      fill: "#fff",
      stroke: "#000",
      strokeWidth: 0.4,
      ...(withFilter && { filter: { name: "dropShadow", args: { dx: 4, dy: 4, blur: 4, opacity: 0.4 } } }),
    };
  }

  return {
    height,
    width,
    markup: [
      { tagName: "rect", attrs: { class: "card-behind" } },
      { tagName: "rect", attrs: { class: "card" } },
      { tagName: "rect", attrs: { class: "content" } },
      { tagName: "rect", attrs: { class: "content-t" } },
      { tagName: "rect", attrs: { class: "content-b" } },
      { tagName: "path", attrs: { class: "bar-t" } },
      { tagName: "path", attrs: { class: "bar-b" } },
      { tagName: "text", attrs: { class: "subtitle" } },
      { tagName: "text", attrs: { class: "title" } },
    ],
    attrs: {
      ".card": cardAttrs(!isStack),
      ".card-behind": {
        ...cardAttrs(isStack),
        ref: ".card",
        ...(isStack && { refX: 4, refY: 4 }),
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
      ".subtitle": {
        refX: 0.5,
        refY: 0.05,
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "0.5rem",
        fontWeight: "400",
        textAnchor: "middle",
        textWrap: {
          width: width / 20,
          height: Math.min(40, height / 2),
          ellipsis: true,
          breakWord: true,
        },
      },
      ".title": {
        refX: 0.5,
        refY: 0.5,
        fontFamily: "'Playfair Display', serif",
        fontSize: "0.75rem",
        fontWeight: "800",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        textWrap: {
          width: width / 20,
          height: Math.min(40, height / 1.5),
          ellipsis: true,
          breakWord: true,
        },
      },
    },
    propHooks(metadata) {
      const { data, ...rest } = metadata;
      if (data) {
        const value: Person = data.value;
        const { title, subtitle, gender, isDead } = value;

        ObjectExt.setByPath(rest, "attrs/.subtitle/text", subtitle);
        ObjectExt.setByPath(rest, "attrs/.title/text", title);

        const genderOrMale = gender ?? "M";
        const genderOrFemale = gender ?? "F";
        ObjectExt.setByPath(rest, "attrs/.subtitle/fill", resolveFillColor({ gender, isDead }));
        ObjectExt.setByPath(rest, "attrs/.content-t/fill", resolveFillColor({ light: true, gender: genderOrMale }));
        ObjectExt.setByPath(rest, "attrs/.content-b/fill", resolveFillColor({ light: true, gender: genderOrFemale }));
        ObjectExt.setByPath(rest, "attrs/.bar-t/fill", resolveFillColor({ gender: genderOrMale, isDead }));
        ObjectExt.setByPath(rest, "attrs/.bar-b/fill", resolveFillColor({ gender: genderOrFemale, isDead }));
      }
      return { ...rest, data };
    },
  } satisfies Parameters<typeof Graph.registerNode>[1];
}
