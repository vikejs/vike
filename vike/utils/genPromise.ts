export function genPromise<T = void>(): { promise: Promise<T>; resolve: (val: T) => void } {
  let resolve!: (val: T) => void
  const promise = new Promise<T>((r) => (resolve = r))
  return { promise, resolve }
}
