import { assert } from './assert.js'

export { slice }

function slice<Element, T extends Array<Element>>(thing: T, from: number, to: number): T
function slice(thing: string, from: number, to: number): string
function slice(thing: string | unknown[], from: number, to: number): string | unknown[] {
  if (typeof thing === 'string') {
    return sliceArray(thing.split(''), from, to).join('')
  } else {
    return sliceArray(thing, from, to)
  }
}

function sliceArray<Element, T extends Array<Element>>(list: T, from: number, to: number): T {
  const listSlice: T = [] as unknown as T

  let start = from >= 0 ? from : list.length + from
  assert(start >= 0 && start <= list.length)
  let end = to >= 0 ? to : list.length + to
  assert(end >= 0 && end <= list.length)

  while (true) {
    if (start === end) {
      break
    }
    if (start === list.length) {
      start = 0
    }
    if (start === end) {
      break
    }
    const el = list[start]
    assert(el !== undefined)
    listSlice.push(el)
    start++
  }

  return listSlice
}
