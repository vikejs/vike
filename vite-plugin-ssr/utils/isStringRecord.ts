export function isStringRecord(thing: unknown): thing is Record<string, string> {
  return typeof thing === 'object' && thing !== null && Object.values(thing).every((val) => typeof val === 'string')
}
