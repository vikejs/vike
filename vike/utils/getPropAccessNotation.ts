export function getPropAccessNotation(key: string): `.${string}` | `[${string}]` {
  return /^[a-z0-9\$_]+$/i.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`
}
