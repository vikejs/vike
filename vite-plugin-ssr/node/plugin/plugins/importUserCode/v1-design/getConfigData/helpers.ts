export { getPageConfigValues }
export { getPageConfigValue }

import { assertDefaultExportObject } from '../../../../utils'
import type { PageConfigFile } from '../getConfigData'

function getPageConfigValues(plusConfigFile: PageConfigFile): Record<string, unknown> {
  const { plusConfigFilePath, plusConfigFileExports } = plusConfigFile
  assertDefaultExportObject(plusConfigFileExports, plusConfigFilePath)
  const pageConfigValues = plusConfigFileExports.default
  return pageConfigValues
}
function getPageConfigValue(configName: string, plusConfigFile: PageConfigFile): unknown {
  const pageConfigValues = getPageConfigValues(plusConfigFile)
  const configValue = pageConfigValues[configName]
  return configValue
}
