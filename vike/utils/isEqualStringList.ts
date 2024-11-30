export { isEqualStringList }

type StringList = false | string | string[]

function isEqualStringList(a: StringList, b: StringList): boolean {
  if (a === b) return true
  if (Array.isArray(a) && Array.isArray(b)) {
    const sortedA = [...a].sort()
    const sortedB = [...b].sort()
    return sortedA.length === sortedB.length && sortedA.every((val, i) => val === sortedB[i])
  }
  return false
}
