export { assertDefaultExportUnknown }
export { assertDefaultExportObject }

import { assertUsage } from './assert'
import { hasProp } from './hasProp'
import { checkType } from './checkType'
import { isObject } from './isObject'

type SingleDefaultExport = { default: unknown }
function assertDefaultExportUnknown(
  fileExports: Record<string, unknown>,
  filePath: string
): asserts fileExports is SingleDefaultExport {
  assertSingleDefaultExport(fileExports, filePath, true)
}

function assertDefaultExportObject(
  fileExports: Record<string, unknown>,
  filePath: string
): asserts fileExports is { default: Record<string, unknown> } {
  assertSingleDefaultExport(fileExports, filePath, false)
  const defaultExport = fileExports.default
  assertUsage(
    isObject(defaultExport),
    `${filePath} should export an object: its \`export default\` is a \`${typeof defaultExport}\` but it should be an object`
  )
}

function assertSingleDefaultExport(
  fileExports: Record<string, unknown>,
  filePath: string,
  defaultExportValueIsUnknown: boolean
): asserts fileExports is SingleDefaultExport {
  {
    const invalidExports = Object.keys(fileExports).filter((e) => e !== 'default')
    const invalidExportsStr = invalidExports.join(', ')
    const correctUsage = defaultExportValueIsUnknown
      ? `\`export default\``
      : `\`export default { ${invalidExportsStr} }\``
    assertUsage(
      invalidExports.length === 0,
      `${filePath} should have a single default export: replace \`export { ${invalidExportsStr} }\` with ${correctUsage}`
    )
  }
  assertUsage(hasProp(fileExports, 'default'), `${filePath} should have a \`export default\``)
  checkType<SingleDefaultExport>(fileExports)
}
