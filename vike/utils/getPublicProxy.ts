export { getPublicProxy }

// We use a proxy instead of property getters.
// - The issue with property getters is that they can't be `writable: true` but we do want the user to be able to modify the value of internal properties.
//   ```console
//   TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
//   ```
// - Previous implementation using property getters: https://github.com/vikejs/vike/blob/main/vike/utils/makePublicCopy.ts

import { assertWarning } from './assert.js'

// Show warning when user is accessing internal `_` properties.
function getPublicProxy<Obj extends Record<string, unknown>>(obj: Obj, objName: string): Obj {
  return new Proxy(obj, {
    get(_, prop) {
      const propStr = String(prop)
      if (propStr.startsWith('_')) {
        assertWarning(
          false,
          `Using internal ${objName}.${propStr} which may break in any minor version update. Reach out on GitHub to request official support for your use case.`,
          { onlyOnce: true }
        )
      }
      // @ts-ignore Seems to be TypeScript bug
      return Reflect.get(...arguments)
    }
  })
}
