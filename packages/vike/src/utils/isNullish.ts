export function isNullish(val: unknown): val is null | undefined {
  return val === null || val === undefined
}
// someArray.filter(isNotNullish)
export function isNotNullish<T>(p: T | null | undefined): p is T {
  return !isNullish(p)
}
