export { getConfigFileExport }

import pc from '@brillout/picocolors'
import { assertPlusFileExport } from '../../../../shared/page-configs/assertPlusFileExport.js'
import { assertUsage, isObject } from '../../utils.js'

function getConfigFileExport(
  fileExports: Record<string, unknown>,
  filePathToShowToUser: string
): Record<string, unknown> {
  assertPlusFileExport(fileExports, filePathToShowToUser, 'config')
  const usesNamedExport = !!fileExports.config
  const fileExport = usesNamedExport ? fileExports.config : fileExports.default
  const exportName = pc.cyan(usesNamedExport ? 'export { config }' : 'export default')
  assertUsage(
    isObject(fileExport),
    `The ${exportName} of ${filePathToShowToUser} should be an object (but it's ${pc.cyan(
      `typeof exportedValue === ${JSON.stringify(typeof fileExport)}`
    )} instead)`
  )
  return fileExport
}
