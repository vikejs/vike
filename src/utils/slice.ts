import { assert } from './assert'

export { slice }

function slice<Element, T extends Array<Element>>(
  list: T,
  from: number,
  to: number
): T {
  const listSlice: T = ([] as unknown) as T

  let begin = from >= 0 ? from : list.length + from
  assert(begin >= 0 && begin < list.length)
  const end = to >= 0 ? to : list.length + to
  assert(end >= 0 && end < list.length)

  while (begin !== end) {
    listSlice.push(list[begin])
    begin++
    if (begin === list.length) {
      begin = 0
    }
  }

  return listSlice
}
