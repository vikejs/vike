export { updateType }

import { assert } from './assert.js'

/** Help TypeScript update the type of dynamically modified objects. */
function updateType<Thing, Clone>(thing: Thing, clone: Clone): asserts thing is Thing & Clone {
  // @ts-ignore
  assert(thing === clone)
}
