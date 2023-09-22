export function getGlobalObject<T extends Record<string, unknown> = never>(
  // We use the filename as key; each `getGlobalObject()` call should live in a unique filename.
  key: `${string}.ts`,
  defaultValue: T
): T {
  const allGlobalObjects = (globalThis.__vite_plugin_ssr = globalThis.__vite_plugin_ssr || {})
  const globalObject = (allGlobalObjects[key] = (allGlobalObjects[key] as T) || defaultValue)
  return globalObject
}
declare global {
  var __vite_plugin_ssr: undefined | Record<string, Record<string, unknown>>
}
