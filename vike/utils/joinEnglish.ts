export { joinEnglish }

import { assert } from './assert.js'

// https://stackoverflow.com/questions/53879088/join-an-array-by-commas-and-and/53879103#53879103
function joinEnglish(
  arr: string[] | readonly string[],
  conjunction: 'or' | 'and',
  colorizer: (s: string) => string = (s) => s
): string {
  assert(arr.length > 0)
  if (arr.length === 1) return colorizer(arr[0]!)
  const firsts = arr.slice(0, arr.length - 1)
  const last = arr[arr.length - 1]!
  return firsts.map(colorizer).join(', ') + ` ${conjunction} ` + colorizer(last)
}
