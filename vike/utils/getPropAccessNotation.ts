export function getPropAccessNotation(key: unknown): `.${string}` | `[${string}]` {
  return typeof key === 'string' && /^[a-z0-9\$_]+$/i.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`
}
