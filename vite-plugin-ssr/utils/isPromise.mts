import { isCallable } from './isCallable.mjs'
export function isPromise(val: unknown): val is Promise<unknown> {
  return typeof val === 'object' && val !== null && 'then' in val && isCallable((val as Record<string, unknown>).then)
}
