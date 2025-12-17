// Type inference for:
// ```js
// Object.fromEntries(Object.entries(obj).filter(someFilter))
// ```
export function objectFilter<T, U extends T>(
  obj: Record<string, T>,
  filter: (entry: [string, T]) => entry is [string, U],
): Record<string, U> {
  return Object.fromEntries(Object.entries(obj).filter(filter))
}
