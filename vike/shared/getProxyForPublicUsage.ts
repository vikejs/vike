export { getProxyForPublicUsage }
export { getProxyForMutationTracking }

// We use a proxy instead of property getters.
// - The issue with property getters is that they can't be `writable: true` but we do want the user to be able to modify the value of internal properties.
//   ```console
//   TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
//   ```
// - Previous implementation using property getters: https://github.com/vikejs/vike/blob/main/vike/utils/makePublicCopy.ts

// Show warning when user is accessing internal `_` properties.

import { NOT_SERIALIZABLE } from './NOT_SERIALIZABLE.js'
import { assert, assertUsage, assertWarning, getPropAccessNotation, isBrowser } from './utils.js'

type Target = Record<string, unknown> & { _onChange?: () => void }

function getProxyForPublicUsage<Obj extends Target>(obj: Obj, objName: string, skipOnInternalProp?: true): Obj {
  return new Proxy(obj, {
    get: getTrapGet(obj, objName, skipOnInternalProp)
  })
}

function getTrapGet(obj: Record<string, unknown>, objName: string, skipOnInternalProp?: true) {
  return function (_: any, prop: string | symbol) {
    const propStr = String(prop)
    if (!skipOnInternalProp) onInternalProp(propStr, objName)
    const val = obj[prop as any]
    onNotSerializable(propStr, val, objName)
    return val
  }
}

function getProxyForMutationTracking<Obj extends Target>(obj: Obj): Obj {
  return new Proxy(obj, {
    set(...args) {
      const ret = Reflect.set(...args)
      obj._onChange?.()
      return ret
    },
    defineProperty(...args) {
      const ret = Reflect.defineProperty(...args)
      obj._onChange?.()
      return ret
    },
    deleteProperty(...args) {
      const ret = Reflect.deleteProperty(...args)
      obj._onChange?.()
      return ret
    }
  })
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
  // TODO/now remove this and only warn on built-in access instead
  if (propStr === '_configFromHook') return

  if (propStr.startsWith('_')) {
    assertWarning(
      false,
      `Using internal ${objName}.${propStr} which may break in any minor version update. Reach out on GitHub to request official support for your use case.`,
      { onlyOnce: true, showStackTrace: true }
    )
  }
}
