export { getPageConfigValues }
export { getPageConfigValue }

import { assertDefaultExportObject } from '../../../../utils'
import type { PlusConfigFile } from '../getConfigData'

function getPageConfigValues(plusConfigFile: PlusConfigFile): Record<string, unknown> {
  const { plusConfigFilePath, plusConfigFileExports } = plusConfigFile
  assertDefaultExportObject(plusConfigFileExports, plusConfigFilePath)
  const pageConfigValues = plusConfigFileExports.default
  return pageConfigValues
}
function getPageConfigValue(configName: string, plusConfigFile: PlusConfigFile): unknown {
  const pageConfigValues = getPageConfigValues(plusConfigFile)
  const configValue = pageConfigValues[configName]
  return configValue
}
