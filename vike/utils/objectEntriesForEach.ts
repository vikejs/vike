/** Same as Object.entries().forEach() but with type inference */
export function objectEntriesForEach<Obj extends object>(
  obj: Obj,
  iterator: <Key extends keyof Obj>(key: Key, val: Obj[Key]) => void
): void {
  Object.entries(obj).forEach(([key, val]) => iterator(key as keyof Obj, val))
}
