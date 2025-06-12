export function isCallable<T extends (...args: any[]) => any>(thing: T | unknown): thing is T {
  return thing instanceof Function || typeof thing === 'function'
}
