export { assertDefaultExport }
export { assertDefaultExportObject }

import { assertUsage } from './assert'
import { hasProp } from './hasProp'
import { checkType } from './checkType'
import { isObject } from './isObject'

type SingleDefaultExport = { default: unknown }
function assertDefaultExport(
  fileExports: Record<string, unknown>,
  filePath: string
): asserts fileExports is SingleDefaultExport {
  {
    const invalidExports = Object.keys(fileExports).filter((e) => e !== 'default')
    const invalidExportsStr = invalidExports.join(', ')
    assertUsage(
      invalidExports.length === 0,
      `${filePath} should have a single default export: replace \`export { ${invalidExportsStr} }\` with \`export default { ${invalidExportsStr} }\``
    )
  }
  assertUsage(hasProp(fileExports, 'default'), `${filePath} should have a \`export default\``)
  checkType<SingleDefaultExport>(fileExports)
}

function assertDefaultExportObject(
  fileExports: Record<string, unknown>,
  filePath: string
): asserts fileExports is { default: Record<string, unknown> } {
  assertDefaultExport(fileExports, filePath)
  const defaultExport = fileExports.default
  assertUsage(
    isObject(defaultExport),
    `${filePath} should export an object: its \`export default\` is a \`${typeof defaultExport}\` but it should be an object`
  )
}
