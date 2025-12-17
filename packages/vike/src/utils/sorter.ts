import { assert } from './assert.js'

export { higherFirst }
export { lowerFirst }
export { makeFirst }
export { makeLast }
export { reverse }
export type { SortReturn }

/**
 * # How to use `Array.prototype.sort()`
 *
 * ```js
 * elements.sort(sorter);
 * function sorter(element1: unknown, element2: unknown): -1 | 0 | 1
 * ```
 * -1 => element1 first: `elements.indexOf(element1) < elements.indexOf(element2)`
 * +1 => element2 first: `elements.indexOf(element2) < elements.indexOf(element1)`
 *  0 => keep original order of element1 and element2
 */
type SortReturn = -1 | 0 | 1

/**
 * ```js
 * let arr = [
 *   { price: 10 },
 *   { price: 1000 },
 *   { price: 100 }
 * ]
 * arr = arr.sort(higherFirst(el => el.price))
 * isEqual(arr, [
 *   { price: 1000 },
 *   { price: 100 },
 *   { price: 10 }
 * ])
 * ```
 */
function higherFirst<T>(getValue: (element: T) => number): (element1: T, element2: T) => SortReturn {
  return (element1: T, element2: T) => {
    const val1 = getValue(element1)
    const val2 = getValue(element2)
    if (val1 === val2) {
      return 0
    }
    return val1 > val2 ? -1 : 1
  }
}

/**
 * ```js
 * let arr = [
 *   { price: 10 },
 *   { price: 1000 },
 *   { price: 100 }
 * ]
 * arr = arr.sort(lowerFirst(el => el.price))
 * isEqual(arr, [
 *   { price: 10 },
 *   { price: 100 },
 *   { price: 1000 }
 * ])
 * ```
 */
function lowerFirst<T>(getValue: (element: T) => number): (element1: T, element2: T) => SortReturn {
  return (element1: T, element2: T) => {
    const val1 = getValue(element1)
    const val2 = getValue(element2)
    if (val1 === val2) {
      return 0
    }
    return val1 < val2 ? -1 : 1
  }
}

/**
 * ```js
 * let arr = [
 *  { name: 'iphone', isRocket: false },
 *  { name: 'starship', isRocket: true }
 * ]
 * arr = arr.sort(makeFirst(el => el.isRocket))
 * isEqual(arr, [
 *  { name: 'starship', isRocket: true },
 *  { name: 'iphone', isRocket: false }
 * ])
 * ```
 */
function makeFirst<T>(getValue: (element: T) => boolean | null): (element1: T, element2: T) => SortReturn {
  return (element1: T, element2: T) => {
    const val1 = getValue(element1)
    const val2 = getValue(element2)
    assert([true, false, null].includes(val1))
    assert([true, false, null].includes(val2))
    if (val1 === val2) {
      return 0
    }
    if (val1 === true || val2 === false) {
      return -1
    }
    if (val2 === true || val1 === false) {
      return 1
    }
    assert(false)
  }
}

/**
 * ```js
 * let arr = [
 *  { name: 'starship', isRocket: true },
 *  { name: 'iphone', isRocket: false }
 * ]
 * arr = arr.sort(makeLast(el => el.isRocket))
 * isEqual(arr, [
 *  { name: 'iphone', isRocket: false },
 *  { name: 'starship', isRocket: true }
 * ])
 * ```
 */
function makeLast<T>(getValue: (element: T) => boolean | null) {
  return makeFirst((element: T) => {
    const val = getValue(element)
    if (val === null) {
      return null
    } else {
      return !val
    }
  })
}

/** Reverse order result. */
function reverse(sortKey: SortReturn): SortReturn {
  return (-1 * sortKey) as any
}
