export { objectEntries }
export { objectFromEntries }
export { objectKeys }
// export { forEach }

// https://stackoverflow.com/questions/60141960/typescript-key-value-relation-preserving-object-entries-type/75337277#75337277
/** Same as Object.entries() but with type inference */
function objectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as any
}

/** Same as Object.fromEntries() but with type inference */
function objectFromEntries<T extends [PropertyKey, unknown][]>(arr: T): Record<T[number][0], T[number][1]> {
  return Object.fromEntries(arr) as any
}

// https://stackoverflow.com/questions/52856496/typescript-object-keys-return-string
// https://github.com/sindresorhus/ts-extras/blob/main/source/object-keys.ts
/** Same as Object.keys() but with type inference */
function objectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as any
}

/* Not used yet, but can be quite useful.
function forEach<Obj extends object>(
  obj: Obj,
  iterator: <Key extends keyof Obj>(key: Key, val: Obj[Key]) => void
): void {
  Object.entries(obj).forEach(([key, val]) => iterator(key as keyof Obj, val))
}
//*/
