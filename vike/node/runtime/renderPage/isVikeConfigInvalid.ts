export { isVikeConfigInvalid }
export { isVikeConfigInvalid_set }

import { assert } from '../utils.js'

let isVikeConfigInvalid: false | { err: unknown }

const isVikeConfigInvalid_set = (val: typeof isVikeConfigInvalid) => {
  assert(val === false || val.err)
  isVikeConfigInvalid = val
}
