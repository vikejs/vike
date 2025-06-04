export { getProxyForPublicUsage }

// We use a proxy instead of property getters.
// - The issue with property getters is that they can't be `writable: true` but we do want the user to be able to modify the value of internal properties.
//   ```console
//   TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
//   ```
// - Previous implementation using property getters: https://github.com/vikejs/vike/blob/main/vike/utils/makePublicCopy.ts

// Show warning when user is accessing internal `_` properties.

import { NOT_SERIALIZABLE } from './NOT_SERIALIZABLE.js'
import { assert, assertUsage, assertWarning, getPropAccessNotation, isBrowser } from './utils.js'

type Target = Record<string, unknown>
type Fallback = (prop: string | symbol) => unknown

function getProxyForPublicUsage<Obj extends Target>(
  obj: Obj,
  objName: 'pageContext' | 'globalContext' | 'prerenderContext' | 'vikeConfig',
  skipOnInternalProp?: true,
  fallback?: Fallback
): Obj {
  return new Proxy(obj, {
    get: getTrapGet(obj, objName, skipOnInternalProp, fallback)
  })
}

function getTrapGet(
  obj: Record<string | symbol, unknown>,
  objName: string,
  skipOnInternalProp?: true,
  fallback?: Fallback
) {
  return function (_: any, prop: string | symbol) {
    const propStr = String(prop)
    if (prop === '_isProxyObject') return true
    if (!skipOnInternalProp) onInternalProp(propStr, objName)
    if (fallback && !(prop in obj)) {
      // Rudimentary flat pageContext implementation https://github.com/vikejs/vike/issues/1268
      // Failed full-fledged implementation: https://github.com/vikejs/vike/pull/2458
      return fallback(prop)
    }
    const val = obj[prop]
    onNotSerializable(propStr, val, objName)
    return val
  }
}

function onNotSerializable(propStr: string, val: unknown, objName: string) {
  if (val !== NOT_SERIALIZABLE) return
  const propName = getPropAccessNotation(propStr)
  assert(isBrowser())
  assertUsage(
    false,
    `Can't access ${objName}${propName} on the client side. Because it can't be serialized, see server logs.`
  )
}

function onInternalProp(propStr: string, objName: string) {
  // - We must skip it in the client-side because of the reactivity mechanism of UI frameworks like Solid.
  // - TO-DO/eventually: use import.meta.CLIENT instead of isBrowser()
  //   - Where import.meta.CLIENT is defined by Vike
  //   - Using import.meta.env.CLIENT (note `.env.`) doesn't seem possible: https://github.com/brillout/playground_node_import.meta.env
  //     - If Rolldown Vite + Rolldowns always transpiles node_modules/ then we can simply use import.meta.env.SSR
  if (isBrowser()) return
  // TODO/now-proxy remove this and only warn on built-in access instead
  if (propStr === '_configFromHook') return

  if (propStr.startsWith('_')) {
    assertWarning(
      false,
      `Using internal ${objName}.${propStr} which may break in any minor version update. Reach out on GitHub to request official support for your use case.`,
      { onlyOnce: true, showStackTrace: true }
    )
  }
}
