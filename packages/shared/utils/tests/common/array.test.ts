// This file was written with AI assistance (ChatGPT)
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { intersectionBy, removeFalsy } from "@/common";

describe("removeFalsy (property-based)", () => {
  it("returns only truthy values", () => {
    fc.assert(
      fc.property(
        fc.array(fc.anything()), // anything can include null, undefined, false, 0, NaN, ''
        (arr) => {
          const result = removeFalsy(arr);

          result.forEach((item) => {
            expect(Boolean(item)).toBe(true);
          });
        },
      ),
    );
  });

  it("keeps all original truthy values", () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        const result = removeFalsy(arr);

        arr.filter(Boolean).forEach((truthyItem) => {
          expect(result).toContain(truthyItem);
        });
      }),
    );
  });

  it("never increases array length", () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        const result = removeFalsy(arr);
        expect(result.length).toBeLessThanOrEqual(arr.length);
      }),
    );
  });

  it("is idempotent", () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        const firstPass = removeFalsy(arr);
        const secondPass = removeFalsy(firstPass);
        expect(secondPass).toEqual(firstPass);
      }),
    );
  });

  it("works with empty array", () => {
    expect(removeFalsy([])).toEqual([]);
  });
});

describe("intersectionBy (property-based)", () => {
  it("all results are from first array", () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), fc.array(fc.anything()), fc.func(fc.anything()), (a, b, selector) => {
        const result = intersectionBy(a, b, selector);
        result.forEach((item) => {
          expect(a).toContain(item);
        });
      }),
    );
  });

  it("all results exist in second array under selector", () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), fc.array(fc.anything()), fc.func(fc.anything()), (a, b, selector) => {
        const setB = new Set(b.map(selector));
        const result = intersectionBy(a, b, selector);
        result.forEach((item) => {
          expect(setB.has(selector(item))).toBe(true);
        });
      }),
    );
  });

  it("is idempotent", () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), fc.array(fc.anything()), fc.func(fc.anything()), (a, b, selector) => {
        const firstPass = intersectionBy(a, b, selector);
        const secondPass = intersectionBy(firstPass, b, selector);
        expect(secondPass).toEqual(firstPass);
      }),
    );
  });

  it("handles empty arrays", () => {
    const selector = (x: unknown) => x;

    expect(intersectionBy(undefined, undefined, selector)).toEqual([]);
    expect(intersectionBy([], [], selector)).toEqual([]);
    expect(intersectionBy([1, 2, 3], [], selector)).toEqual([]);
    expect(intersectionBy([], [1, 2, 3], selector)).toEqual([]);
  });

  it("works with selectors producing derived values", () => {
    const a = [{ x: 1 }, { x: 2 }];
    const b = [{ x: 2 }, { x: 3 }];
    const result = intersectionBy(a, b, (item) => item.x);
    expect(result).toEqual([{ x: 2 }]);
  });
});
