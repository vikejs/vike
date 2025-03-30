export { preservePropertyGetters }

import { assert } from './assert.js'

function preservePropertyGetters<T extends object>(objOriginal: T) {
  // Store original getter descriptors
  const getters = Object.fromEntries(
    Object.entries(Object.getOwnPropertyDescriptors(objOriginal)).filter(([_, desc]) => 'get' in desc)
  )

  // Make getters non-enumerable
  for (const [key, desc] of Object.entries(getters)) {
    Object.defineProperty(objOriginal, key, { ...desc, enumerable: false })
  }

  // Add verification ID
  const objId = Symbol('objId')
  Object.defineProperty(objOriginal, '_objId', {
    value: objId,
    enumerable: true,
    writable: true,
    configurable: true
  })

  return {
    restorePropertyGetters: (objCopy: T) => {
      assert((objOriginal as any)._objId === objId)
      delete (objOriginal as any)._objId
      assert((objCopy as any)._objId === objId)
      delete (objCopy as any)._objId

      for (const [key, desc] of Object.entries(getters)) {
        assert(!(key in objCopy))
        Object.defineProperty(objCopy, key, desc) // Add property getters to copy
        assert(key in objOriginal)
        Object.defineProperty(objOriginal, key, desc) // Restore original `enumerable` value
      }
    }
  }
}
