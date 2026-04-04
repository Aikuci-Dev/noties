export function minMax(a: number, b: number): readonly [number, number] {
  return [Math.min(a, b), Math.max(a, b)];
}
