export function pick<Obj extends object, Keys extends keyof Obj>(obj: Obj, keys: Keys[]): Pick<Obj, Keys> {
  const result = {} as Pick<Obj, Keys>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}
