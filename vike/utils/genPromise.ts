export function genPromise<T>() {
  let resolve!: (val: T) => void
  const promise = new Promise<T>((r) => (resolve = r))
  return { promise, resolve }
}
