export { getConfigFileExport }

import pc from '@brillout/picocolors'
import { assertExportsOfValueFile } from '../../../../../shared/page-configs/assertExports.js'
import { assert, assertUsage, isObject } from '../../../utils.js'

function getConfigFileExport(
  fileExports: Record<string, unknown>,
  filePathToShowToUser: string
): Record<string, unknown> {
  assertExportsOfValueFile(fileExports, filePathToShowToUser, 'config')
  const fileExport = fileExports.default || fileExports.config
  assert('default' in fileExports !== 'config' in fileExports)
  const exportName = pc.cyan('default' in fileExports ? 'export default' : 'export { config }')
  assertUsage(
    isObject(fileExport),
    `The ${exportName} of ${filePathToShowToUser} should be an object (but it's ${pc.cyan(
      `typeof exportedValue === ${JSON.stringify(typeof fileExport)}`
    )} instead)`
  )
  return fileExport
}
