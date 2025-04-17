export { makePublicCopy }

import { assertWarning } from './assert.js'
import { objectKeys } from './objectKeys.js'

/** Prefix internal properties with `_` + show warning */
function makePublicCopy<Obj extends Record<string, unknown>, PropsPublic extends readonly (keyof Obj)[]>(
  obj: Obj,
  objName: string,
  propsPublic: PropsPublic,
  propsInternalNoWarning?: (keyof Obj)[]
): Pick<Obj, PropsPublic[number]> {
  const objPublic = {} as Pick<Obj, PropsPublic[number]>
  objectKeys(obj).forEach((key) => {
    const val = obj[key]
    if (propsPublic.includes(key)) {
      objPublic[key] = val
    } else {
      const keyPublic = (key as string).startsWith('_') ? key : `_${key as string}`
      if (propsInternalNoWarning?.includes(key)) {
        // @ts-expect-error
        objPublic[keyPublic] = val
      } else {
        Object.defineProperty(objPublic, keyPublic, {
          configurable: true,
          enumerable: true,
          get() {
            assertWarning(
              false,
              `Using internal ${objName}.${keyPublic as string} which may break in any minor version update. Reach out on GitHub and elaborate your use case so that the Vike team can add official support for your use case.`,
              { onlyOnce: true }
            )
            return val
          }
        })
      }
    }
  })
  return objPublic
}
