import { hasProp } from './hasProp'
import { isCallable } from './isCallable'

export { isPromise }

function isPromise(thing: unknown) {
  return hasProp(thing, 'then') && isCallable(thing.then)
}
