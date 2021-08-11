export { isCallable }

function isCallable<T extends Function>(thing: T | unknown): thing is T {
  return thing instanceof Function || typeof thing === 'function'
}
