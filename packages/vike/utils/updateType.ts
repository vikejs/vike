export { updateType }

import { assert } from './assert.js'

/** Help TypeScript augment the type of objects. */
function updateType<Thing, Clone>(thing: Thing, clone: Clone): asserts thing is Thing & Clone {
  // @ts-ignore
  assert(thing === clone)
}
