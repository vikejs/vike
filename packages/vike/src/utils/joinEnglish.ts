export { joinEnglish }

import { assert } from './assert.js'

// https://stackoverflow.com/questions/53879088/join-an-array-by-commas-and-and/53879103#53879103
function joinEnglish(
  arr: string[] | readonly string[],
  conjunction: 'or' | 'and',
  { color = (s) => s, trailingComma = true }: { color?: (s: string) => string; trailingComma?: boolean } = {},
): string {
  assert(arr.length > 0)
  if (arr.length === 1) return color(arr[0]!)
  const firsts = arr.slice(0, arr.length - 1)
  const last = arr[arr.length - 1]!
  const lastComma = trailingComma && arr.length > 2 ? ',' : ''
  return firsts.map(color).join(', ') + `${lastComma} ${conjunction} ` + color(last)
}
