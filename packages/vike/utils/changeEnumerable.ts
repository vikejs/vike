/** Change enumerability of an object property. */
export function changeEnumerable(obj: Object, prop: string, enumerable: boolean) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop)
  Object.defineProperty(obj, prop, { ...descriptor, enumerable })
}
