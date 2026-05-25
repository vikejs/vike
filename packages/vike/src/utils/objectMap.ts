/** Same as Array#map() but for an object's values (keys preserved), with type inference. */
export function objectMap<T, U>(obj: Record<string, T>, mapper: (value: T, key: string) => U): Record<string, U> {
  return Object.fromEntries(Object.entries(obj).map(([key, value]): [string, U] => [key, mapper(value, key)]))
}
