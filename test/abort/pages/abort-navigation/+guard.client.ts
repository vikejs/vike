export default guard

import { abort } from 'vike/abort'

function guard() {
  throw abort()
}
