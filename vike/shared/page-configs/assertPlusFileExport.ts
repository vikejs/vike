export { assertPlusFileExport }

import { assert, assertUsage } from '../utils.js'
import pc from '@brillout/picocolors'

function assertPlusFileExport(fileExports: Record<string, unknown>, filePathToShowToUser: string, configName: string) {
  const exportNames = Object.keys(fileExports)
  const isValid = (exportName: string) => exportName === 'default' || exportName === configName
  const exportNamesValid = exportNames.filter(isValid)
  const exportDefault = pc.code('export default')
  const exportNamed = pc.code(`export { ${configName} }`)
  if (exportNamesValid.length === 0) {
    assertUsage(false, `${filePathToShowToUser} should have ${exportNamed} or ${exportDefault}`)
  }
  if (exportNamesValid.length === 2) {
    assertUsage(false, `${filePathToShowToUser} is ambiguous: remove ${exportDefault} or ${exportNamed}`)
  }
  assert(exportNamesValid.length === 1)
}
