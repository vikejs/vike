export { getPlusConfigValues }
export { getPlusConfigValue }

import { assertDefaultExportObject } from '../../../../utils'
import type { PlusConfigFile } from '../getConfigData'

function getPlusConfigValues(plusConfigFile: PlusConfigFile): Record<string, unknown> {
  const { plusConfigFilePath, plusConfigFileExports } = plusConfigFile
  assertDefaultExportObject(plusConfigFileExports, plusConfigFilePath)
  const plusConfigValues = plusConfigFileExports.default
  return plusConfigValues
}
function getPlusConfigValue(configName: string, plusConfigFile: PlusConfigFile): unknown {
  const plusConfigValues = getPlusConfigValues(plusConfigFile)
  const configValue = plusConfigValues[configName]
  return configValue
}
