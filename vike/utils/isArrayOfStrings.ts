export function isArrayOfStrings(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((v) => typeof v === 'string')
}
