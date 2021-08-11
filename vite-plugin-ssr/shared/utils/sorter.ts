export { higherFirst }
export { lowerFirst }

function higherFirst<T>(getValue: (element: T) => number): (element1: T, element2: T) => number {
  return (element1: T, element2: T) => {
    return getValue(element2) - getValue(element1)
  }
}

function lowerFirst<T>(getValue: (element: T) => number): (element1: T, element2: T) => number {
  return (element1: T, element2: T) => {
    return getValue(element1) - getValue(element2)
  }
}
