import { assert } from './assert'

export { higherFirst }
export { lowerFirst }
export { makeFirst }
export { makeLast }

// -1 => element1 first
// +1 => element2 first
function higherFirst<T>(getValue: (element: T) => number): (element1: T, element2: T) => 0 | 1 | -1 {
  return (element1: T, element2: T) => {
    const val1 = getValue(element1)
    const val2 = getValue(element2)
    if (val1 === val2) {
      return 0
    }
    return val1 > val2 ? -1 : 1
  }
}

function lowerFirst<T>(getValue: (element: T) => number): (element1: T, element2: T) => 0 | 1 | -1 {
  return (element1: T, element2: T) => {
    const val1 = getValue(element1)
    const val2 = getValue(element2)
    if (val1 === val2) {
      return 0
    }
    return val1 < val2 ? -1 : 1
  }
}

function makeFirst<T>(getValue: (element: T) => boolean): (element1: T, element2: T) => 0 | 1 | -1 {
  return (element1: T, element2: T) => {
    const val1 = getValue(element1)
    const val2 = getValue(element2)
    assert([true, false].includes(val1))
    assert([true, false].includes(val2))
    if (val1 === val2) {
      return 0
    }
    if (val1) {
      return -1 // element1 first
    }
    if (val2) {
      return 1 // element2 first
    }
    assert(false)
  }
}

function makeLast<T>(getValue: (element: T) => boolean) {
  return makeFirst((element: T) => !getValue(element))
}
