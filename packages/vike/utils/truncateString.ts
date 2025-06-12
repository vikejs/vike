export { truncateString }

import pc from '@brillout/picocolors'
import { assert } from './assert.js'

function truncateString(str: string, lenMax: number) {
  const lenMaxReal = lenMax - 3
  assert(lenMaxReal >= 1) // Show at least one character before the ellipsis
  if (str.length < lenMax) {
    return str
  } else {
    // Breaks ANSI codes.
    //  - So far, the `str` we pass to truncateString(str) is always expected to not contain any ANSI code
    str = str.substring(0, lenMaxReal)
    const ellipsis = pc.dim('...')
    str = str + ellipsis
    return str
  }
}
