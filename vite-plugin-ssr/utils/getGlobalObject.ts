export function getGlobalObject<T extends Record<string, unknown> = never>(
  fileName: `${string}.ts`,
  defaultValue: T
): T {
  const allGlobalObjects = (globalThis.__vite_plugin_ssr = globalThis.__vite_plugin_ssr || {})
  const globalObject = (allGlobalObjects[fileName] = (allGlobalObjects[fileName] as T) || defaultValue)
  return globalObject
}
declare global {
  var __vite_plugin_ssr: undefined | Record<string, Record<string, unknown>>
}
