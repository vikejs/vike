export { isCallable }

function isCallable<T extends (...args: unknown[]) => unknown>(thing: T | unknown): thing is T {
  return thing instanceof Function || typeof thing === 'function'
}
