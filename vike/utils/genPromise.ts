export function genPromise<T = void>(): {
  promise: Promise<T>
  resolve: (val: T) => void
  reject: (err: unknown) => void
} {
  let resolve!: (val: T) => void
  let reject!: (err: unknown) => void
  const promise = new Promise<T>((resolve_, reject_) => {
    resolve = resolve_
    reject = reject_
  })
  return { promise, resolve, reject }
}
