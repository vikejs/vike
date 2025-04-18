export { getPublicProxy }

// We use a proxy instead of property getters.
// - The issue with property getters is that they can't be `writable: true` but we do want the user to be able to modify the value of internal properties.
//   ```console
//   TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
//   ```
// - Previous implementation using property getters: https://github.com/vikejs/vike/blob/main/vike/utils/makePublicCopy.ts

import { assert, assertWarning } from './assert.js'

// Show warning when user is accessing internal `_` properties.
function getPublicProxy<Obj extends Record<string, unknown>, PropsPublic extends readonly (keyof Obj)[]>(
  obj: Obj,
  objName: string,
  propsPublic: PropsPublic,
  expectCustomUserLandProps?: true
): Pick<Obj, PropsPublic[number]> {
  if (!expectCustomUserLandProps) {
    Object.keys(obj).forEach((key) => assert(key.startsWith('_') || propsPublic.includes(key)))
    propsPublic.forEach((prop) => prop in obj)
  }

  return new Proxy(obj, {
    get(_, prop) {
      const propStr = String(prop)
      if (propStr.startsWith('_')) {
        assertWarning(
          false,
          `Using internal ${objName}.${propStr} which may break in any minor version update. Reach out on GitHub and elaborate your use case so that the Vike team can add official support for your use case.`,
          { onlyOnce: true }
        )
      }
      // @ts-ignore Seems to be TypeScript bug
      return Reflect.get(...arguments)
    }
  })
}
