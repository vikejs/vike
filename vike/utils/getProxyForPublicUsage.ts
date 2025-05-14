export { getProxyForPublicUsage }

// We use a proxy instead of property getters.
// - The issue with property getters is that they can't be `writable: true` but we do want the user to be able to modify the value of internal properties.
//   ```console
//   TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
//   ```
// - Previous implementation using property getters: https://github.com/vikejs/vike/blob/main/vike/utils/makePublicCopy.ts

import { assertWarning } from './assert.js'
import { isBrowser } from './isBrowser.js'

// Show warning when user is accessing internal `_` properties.
function getProxyForPublicUsage<Obj extends Record<string, unknown>>(obj: Obj, objName: string): Obj {
  return new Proxy(obj, {
    get(_, prop) {
      warnIfInternal(prop, objName)
      return obj[prop as keyof Obj]
    }
  })
}

function warnIfInternal(prop: string | symbol, objName: string) {
  // - We must skip it in the client-side because of the reactivity mechanism of UI frameworks like Solid.
  // - TO-DO/eventually: use import.meta.CLIENT instead of isBrowser()
  //   - Where import.meta.CLIENT is defined by Vike
  //   - Using import.meta.env.CLIENT (note `.env.`) doesn't seem possible: https://github.com/brillout/playground_node_import.meta.env
  //     - If Rolldown Vite + Rolldowns always transpiles node_modules/ then we can simply use import.meta.env.SSR
  if (isBrowser()) return

  const propStr = String(prop)
  if (propStr.startsWith('_')) {
    assertWarning(
      false,
      `Using internal ${objName}.${propStr} which may break in any minor version update. Reach out on GitHub to request official support for your use case.`,
      { onlyOnce: true, showStackTrace: true }
    )
  }
}
