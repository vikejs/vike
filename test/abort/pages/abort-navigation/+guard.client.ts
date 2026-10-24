export default guard

import { Abort } from 'vike/abort'

function guard() {
  throw Abort()
}
