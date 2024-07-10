export function getPropAccessNotation(key: unknown): `.${string}` | `[${string}]` {
  return typeof key === 'string' && isKeyDotNotationCompatible(key) ? `.${key}` : `[${JSON.stringify(key)}]`
}
function isKeyDotNotationCompatible(key: string): boolean {
  return /^[a-z0-9\$_]+$/i.test(key)
}
