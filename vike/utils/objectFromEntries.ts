/** Same as Object.fromEntries() but with type inference */
export function objectFromEntries<T extends [PropertyKey, unknown][]>(arr: T): Record<T[number][0], T[number][1]> {
  return Object.fromEntries(arr) as any
}
