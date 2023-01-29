export { assertDefaultExport }

import { assertUsage } from './assert'
import { hasProp } from './hasProp'
import { checkType } from './checkType'

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
