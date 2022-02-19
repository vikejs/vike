import { hasProp } from './hasProp'
import { isCallable } from './isCallable'

export { isPromise }

function isPromise(thing: unknown): thing is Promise<unknown> {
  return hasProp(thing, 'then') && isCallable(thing.then)
}
