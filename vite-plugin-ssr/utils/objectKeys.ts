/** Same as Object.keys() but with type inference */
export function objectKeys<T extends Record<string, unknown>>(obj: T): Array<keyof T> {
  return Object.keys(obj)
}

// https://stackoverflow.com/questions/52856496/typescript-object-keys-return-string
// https://github.com/sindresorhus/ts-extras/blob/main/source/object-keys.ts
