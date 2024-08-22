export function genPromise<T>(): { promise: Promise<T>; resolve: (val: T) => void } {
  let resolve!: (val: T) => void
  const promise = new Promise<T>((r) => (resolve = r))
  return { promise, resolve }
}
