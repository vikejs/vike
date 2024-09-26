export { augmentType }

import { assert } from './assert.js'

/** Help TypeScript augment the type of objects. */
function augmentType<Thing, Clone>(thing: Thing, clone: Clone): asserts thing is Thing & Clone {
  // @ts-ignore
  assert(thing === clone)
}
