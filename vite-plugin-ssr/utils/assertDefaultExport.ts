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
    const verb = invalidExports.length === 1 ? 'is' : 'are'
    assertUsage(
      invalidExports.length === 0,
      `${filePath} has \`export { ${invalidExportsStr} }\` which ${verb} forbidden: ${filePath} should have a single \`export default\` instead`
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
    `${filePath} should export an object (it exports a \`${typeof defaultExport}\` instead)`
  )
}
