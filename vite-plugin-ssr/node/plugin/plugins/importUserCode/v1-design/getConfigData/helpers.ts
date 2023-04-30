export { getPageConfigValues }
export { getPageConfigValue }

import { assertDefaultExportObject } from '../../../../utils'
import type { PageConfigFile } from '../getConfigData'

function getPageConfigValues(pageConfigFile: PageConfigFile): Record<string, unknown> {
  const { pageConfigFilePath, pageConfigFileExports } = pageConfigFile
  assertDefaultExportObject(pageConfigFileExports, pageConfigFilePath)
  const pageConfigValues = pageConfigFileExports.default
  return pageConfigValues
}
function getPageConfigValue(configName: string, pageConfigFile: PageConfigFile): unknown {
  const pageConfigValues = getPageConfigValues(pageConfigFile)
  const configValue = pageConfigValues[configName]
  return configValue
}
