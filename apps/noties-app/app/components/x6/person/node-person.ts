import type { Graph } from "@antv/x6";
import { ObjectExt } from "@antv/x6";

import type { Dimension, Nullable } from "@noties/shared-type";

export function resolveFillColor(options: { light?: boolean; gender?: Nullable<Gender>; isDead?: boolean }) {
  const { light, gender, isDead } = options;

  if (isDead) return light ? "#e5e7eb" : "#9ca3af"; // Gray (200/400)
  if (gender === "M") return light ? "#bfdbfe" : "#60a5fa"; // Blue (200/400)
  if (gender === "F") return light ? "#fbcfe8" : "#f472b6"; // Pink (200/400)
}

function leftRoundedRectPath(height: number, radius: number): string {
  /**
   * "kappa" constant used to approximate a quarter circle with cubic Bézier curves.
   * See:
   *  - https://spencermortensen.com/articles/bezier-circle/
   *  - https://pomax.github.io/bezierinfo/#circles_cubic
   */
  const k = 0.5522847498;

  const offset = radius * k;
  const inner = radius - offset;

  return [
    `M ${radius} 0`,
    `L ${radius} ${height}`,
    `C ${inner} ${height} 0 ${height - offset} 0 ${height - radius}`,
    `L 0 ${radius}`,
    `C 0 ${offset} ${inner} 0 ${radius} 0`,
    `Z`,
  ].join(" ");
}

export default function nodePerson(options: { dimension: Dimension; radius: number; isStack?: boolean }) {
  const { dimension: { height, width }, radius, isStack } = options;

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
      d: leftRoundedRectPath(height, radius),
    };
  }
  function cardAttrs(withFilter?: boolean) {
    return {
      /**
       * Defining either `rx` or `ry` is enough — the other will mirror the value.
       * See: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/rx#rect
       */
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
        const value: PersonNode = data.value;
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
