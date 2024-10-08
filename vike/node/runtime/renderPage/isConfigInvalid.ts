export { isConfigInvalid }
export { isConfigInvalid_set }

import { assert } from '../utils.js'

let isConfigInvalid: false | { err: unknown }

const isConfigInvalid_set = (val: typeof isConfigInvalid) => {
  assert(val === false || val.err)
  isConfigInvalid = val
}
