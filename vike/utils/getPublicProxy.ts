export { getPublicProxy }

import { assert, assertWarning } from './assert.js'

// Show warning when user is accessing internal `_` properties.
function getPublicProxy<Obj extends Record<string, unknown>, PropsPublic extends readonly (keyof Obj)[]>(
  obj: Obj,
  objName: string,
  propsPublic: PropsPublic
): Pick<Obj, PropsPublic[number]> {
  Object.keys(obj).forEach((key) => assert(key.startsWith('_') || propsPublic.includes(key), { key }))
  propsPublic.forEach((prop) => prop in obj)

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
