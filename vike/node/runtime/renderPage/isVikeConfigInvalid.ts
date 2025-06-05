export { isVikeConfigInvalid }
export { isVikeConfigInvalid_set }

import { assert } from '../utils.js'

let isVikeConfigInvalid: false | { err: unknown }

function isVikeConfigInvalid_set(val: typeof isVikeConfigInvalid): void {
  assert(val === false || val.err)
  isVikeConfigInvalid = val
}
