import { assert, assertUsage, assertWarning } from './assert'
import { isObject } from './isObject'

export { assertExports }

function assertExports(
  fileExports: Record<string, unknown>,
  filePath: string,
  exportNames: string[],
  renamedExports: Record<string, string> = {}
) {
  assert(isObject(fileExports))
  const unknownExports: string[] = []
  Object.keys(fileExports).forEach((exportName) => {
    assertUsage(
      !(exportName in renamedExports),
      `Rename the export \`${exportName}\` to \`${renamedExports[exportName]}\` in ${filePath}`
    )
    if (!exportNames.includes(exportName)) {
      unknownExports.push(exportName)
    }
  })
  const errSuffix = `Only following exports are allowed: ${stringifyListOfStrings(exportNames)}. See https://vite-plugin-ssr.com/custom-exports if you want to re-use code defined in ${filePath}.`
  assertWarning(
    unknownExports.length <= 1,
    `Unknown exports ${stringifyListOfStrings(unknownExports)} in ${filePath}. ${errSuffix}`
  )
  assertWarning(unknownExports.length !== 1, `Unknown export \`${unknownExports[0]}\` in ${filePath}. ${errSuffix}`)
  assert(unknownExports.length === 0)
}

function stringifyListOfStrings(stringList: string[]) {
  return '[' + stringList.map((str) => "'" + str + "'").join(', ') + ']'
}
