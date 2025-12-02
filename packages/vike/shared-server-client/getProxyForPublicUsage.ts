export { getProxyForPublicUsage }
export type { DangerouslyUseInternals }

// We use a proxy instead of property getters.
// - The issue with property getters is that they can't be `writable: true` but we do want the user to be able to modify the value of internal properties.
//   ```console
//   TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
//   ```
// - Previous implementation using property getters: https://github.com/vikejs/vike/blob/4dbb354b0bcec04e862041fc9183fc4691bb8711/vike/utils/makePublicCopy.ts

// Show warning when user is accessing internal `_` properties.

import { NOT_SERIALIZABLE } from './NOT_SERIALIZABLE.js'
import { assert, assertUsage, assertWarning, getPropAccessNotation, isBrowser } from './utils.js'

type Target = Record<string, unknown>
type Fallback = (prop: string | symbol) => unknown

function getProxyForPublicUsage<Obj extends Target>(
  obj: Obj & { _publicProxy?: Obj },
  objName: 'pageContext' | 'globalContext' | 'prerenderContext' | 'vikeConfig',
  skipOnInternalProp?: true,
  fallback?: Fallback,
): Obj & {
  _isProxyObject: true
  /** https://vike.dev/warning/internals */
  dangerouslyUseInternals: DangerouslyUseInternals<Obj>
} {
  obj._publicProxy ??= new Proxy(obj, {
    get: (_: any, prop: string | symbol) => getProp(prop, obj, objName, skipOnInternalProp, fallback),
  })
  return obj._publicProxy as any
}

function getProp(
  prop: string | symbol,
  obj: Record<string | symbol, unknown>,
  objName: string,
  skipOnInternalProp?: true,
  fallback?: Fallback,
) {
  const propStr = String(prop)

  if (prop === '_isProxyObject') return true
  if (prop === 'dangerouslyUseInternals') return obj

  if (!skipOnInternalProp) {
    if (!globalThis.__VIKE__IS_CLIENT) onInternalProp(propStr, objName)
  }

  if (fallback && !(prop in obj)) {
    // Rudimentary flat pageContext implementation https://github.com/vikejs/vike/issues/1268
    // Failed full-fledged implementation: https://github.com/vikejs/vike/pull/2458
    return fallback(prop)
  }

  const val = obj[prop]

  onNotSerializable(propStr, val, objName)

  return val
}

/** https://vike.dev/warning/internals */
type DangerouslyUseInternals<Obj> = Obj

function onNotSerializable(propStr: string, val: unknown, objName: string) {
  if (val !== NOT_SERIALIZABLE) return
  const propName = getPropAccessNotation(propStr)
  assert(isBrowser())
  assertUsage(
    false,
    `Can't access ${objName}${propName} on the client side. Because it can't be serialized, see server logs.`,
  )
}

function onInternalProp(propStr: string, objName: string) {
  // We must skip it on the client-side because of the reactivity mechanism of UI frameworks like Solid.
  assert(!isBrowser())

  // TO-DO/soon/proxy: remove this and only warn on built-in access instead
  if (propStr === '_configFromHook') return

  if (propStr.startsWith('_')) {
    assertWarning(false, `Using internal ${objName}.${propStr} — https://vike.dev/warning/internals`, {
      onlyOnce: true,
      showStackTrace: true,
    })
  }
}
