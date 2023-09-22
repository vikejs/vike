export { getPropAccessNotation }

function getPropAccessNotation(key: string): `.${string}` | `[${string}]` {
  return isKeyDotNotationCompatible(key) ? `.${key}` : `[${JSON.stringify(key)}]`
}
function isKeyDotNotationCompatible(key: string): boolean {
  return /^[a-z0-9\$_]+$/i.test(key)
}
