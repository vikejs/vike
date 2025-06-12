export { freezePartial }

import pc from '@brillout/picocolors'
// Unit tests at ./freezePartial.spec.ts

import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

function freezePartial(obj: Record<string, unknown>, allowList: Record<string, (val: unknown) => boolean>) {
  Object.entries(obj).forEach(([key, val]) => {
    Object.defineProperty(obj, key, {
      get() {
        return val
      },
      set(newVal: unknown) {
        if (key in allowList) {
          const isAllowed = allowList[key]!(newVal)
          if (isAllowed) {
            val = newVal
            return
          } else {
            throw new Error(`Setting wrong value ${pc.cyan(JSON.stringify(newVal))} for property ${pc.cyan(key)}`)
          }
        }
        throw new Error(`You aren't allowed to mutate property ${pc.cyan(key)}`)
      },
      configurable: false,
      enumerable: true,
    })
  })
  Object.preventExtensions(obj)
}
