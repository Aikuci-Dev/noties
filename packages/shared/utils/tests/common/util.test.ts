// This file was written with AI assistance (ChatGPT)
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { isEmpty, isDefined } from "@/common";

describe("isDefined (property-based)", () => {
  it("is idempotent when filtering", () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        const firstPass = arr.filter(isDefined);
        const secondPass = firstPass.filter(isDefined);

        expect(secondPass).toEqual(firstPass);
      }),
    );
  });

  it("does not remove other falsy values", () => {
    expect([false, 0, "", NaN].filter(isDefined)).toEqual([false, 0, "", NaN]);
  });

  it("handles empty arrays", () => {
    expect([].filter(isDefined)).toEqual([]);
  });
});

describe("isEmpty (property-based)", () => {
  it("handles primitive falsy values", () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);

    expect(isEmpty(false)).toBe(true);
    expect(isEmpty(0)).toBe(true);
    expect(isEmpty(NaN)).toBe(true);

    expect(isEmpty("")).toBe(true);
    expect(isEmpty("    ")).toBe(true);
  });

  it("handles objects correctly", () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty({ a: undefined })).toBe(false);
  });

  it("handles arrays correctly", () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty([undefined])).toBe(false);
  });

  /**
   * Edge case: objects without prototype
   */
  it("handles objects created with Object.create(null)", () => {
    const emptyObj = Object.create(null);

    const nonEmptyObj = Object.create(null);
    nonEmptyObj.a = 1;

    expect(isEmpty(emptyObj)).toBe(true);
    expect(isEmpty(nonEmptyObj)).toBe(false);
  });

  /**
   * Edge case: functions are truthy and not treated as objects
   */
  it("does not treat functions as empty", () => {
    expect(isEmpty(() => {})).toBe(false);
  });
});
