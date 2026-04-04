// This file was written with AI assistance (ChatGPT)
import { describe, expect, it } from "vitest";
import fc from "fast-check";

import { minMax } from "./number";

const safeNumber = fc.double({ noNaN: true, noDefaultInfinity: true });

/**
 * Property-based tests for `minMax` (use `fast-check` to generate many random numeric inputs).
 */
describe("minMax (property-based)", () => {
  it("always returns sorted values", () => {
    fc.assert(
      fc.property(safeNumber, safeNumber, (a, b) => {
        const [min, max] = minMax(a, b);

        expect(min).toBeLessThanOrEqual(max);
      }),
    );
  });

  it("always returns the same values as input", () => {
    fc.assert(
      fc.property(safeNumber, safeNumber, (a, b) => {
        const result = minMax(a, b);

        expect(result).toContain(a);
        expect(result).toContain(b);
      }),
    );
  });

  it("matches Math.min / Math.max", () => {
    fc.assert(
      fc.property(safeNumber, safeNumber, (a, b) => {
        const [min, max] = minMax(a, b);

        expect(min).toBe(Math.min(a, b));
        expect(max).toBe(Math.max(a, b));
      }),
    );
  });

  it("is order-independent (commutative behavior)", () => {
    fc.assert(
      fc.property(safeNumber, safeNumber, (a, b) => {
        expect(minMax(a, b)).toEqual(minMax(b, a));
      }),
    );
  });
});
