export function freezePartial(obj: Record<string, unknown>, allowList: Record<string, (val: unknown) => boolean>) {
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
            throw new Error(`Setting wrong value \`${newVal}\` for property \`${key}\``)
          }
        }
        throw new Error(`You aren't allowed to mutate property \`${key}\``)
      },
      configurable: false,
      enumerable: true
    })
  })
  Object.preventExtensions(obj)
}
