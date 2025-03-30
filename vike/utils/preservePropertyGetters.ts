export function preservePropertyGetters<T extends object>(objOriginal: T) {
  // Store original getter descriptors
  const getters = Object.fromEntries(
    Object.entries(Object.getOwnPropertyDescriptors(objOriginal)).filter(([_, desc]) => 'get' in desc)
  )

  // Make getters non-enumerable
  for (const [key, desc] of Object.entries(getters)) {
    Object.defineProperty(objOriginal, key, { ...desc, enumerable: false })
  }

  return {
    restorePropertyGetters: (objCopy: T) => {
      for (const [key, desc] of Object.entries(getters)) {
        Object.defineProperty(objCopy, key, desc) // Restore to copy
        Object.defineProperty(objOriginal, key, desc) // Restore original
      }
      return objCopy
    }
  }
}
