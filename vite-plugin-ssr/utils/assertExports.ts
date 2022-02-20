import { assert, assertUsage, assertWarning } from './assert'
import { isObject } from './isObject'
import { stringifyStringArray } from './stringifyStringArray'

export { assertExports }

function assertExports(
  fileExports: Record<string, unknown>,
  filePath: string,
  exportNames: string[],
  renamedExports: Record<string, string> = {},
  deprecatedExports: Record<string, string> = {},
) {
  assert(isObject(fileExports))
  const unknownExports: string[] = []
  Object.keys(fileExports).forEach((exportName) => {
    assertUsage(
      !(exportName in deprecatedExports),
      `Your ${filePath} exports \`${exportName}\` which has been deprecated in favor of \`${deprecatedExports[exportName]}\`. See \`CHANGELOG.md\`.`,
    )
    assertUsage(
      !(exportName in renamedExports),
      `Rename the export \`${exportName}\` to \`${renamedExports[exportName]}\` in ${filePath}`,
    )
    if (!exportNames.includes(exportName)) {
      unknownExports.push(exportName)
    }
  })
  const errSuffix = `Only following exports are allowed: ${stringifyStringArray(
    exportNames,
  )}. See https://vite-plugin-ssr.com/custom-exports if you want to re-use code defined in ${filePath}.`
  if (unknownExports.length !== 0) {
    if (unknownExports.length === 1) {
      // assertWarning(false, `Unknown exports ${stringifyStringArray(unknownExports)} in ${filePath}. ${errSuffix}`)
    } else {
      assert(unknownExports.length >= 2)
      assertWarning(false, `Unknown export \`${unknownExports[0]}\` in ${filePath}. ${errSuffix}`)
    }
  }
}
