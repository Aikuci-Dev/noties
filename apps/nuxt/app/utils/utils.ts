export function composeEventHandlers<TEvent extends Event, TArgs extends unknown[]>(
  base: (e: TEvent) => void,
  handler: (...args: TArgs) => void,
  adapter?: (e: TEvent) => TArgs,
) {
  return (e: TEvent) => {
    base(e);

    const args = adapter ? adapter(e) : ([] as unknown as TArgs);
    handler(...args);
  };
}

export function move<T>(arr: T[], from: number, to: number) {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item as T);
  return copy;
}
