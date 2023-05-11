export { getConfigKeys }
// TODO: rename
export { getPageConfigValue }

import { assertDefaultExportObject } from '../../../../utils'
import type { PlusConfigFile } from '../getConfigData'

function getConfigKeys(plusConfigFile: PlusConfigFile) {
  const configValues = getPageConfigValues(plusConfigFile)
  return Object.keys(configValues)
}

function getPageConfigValue(
  configName: string,
  plusConfigFile: PlusConfigFile
): null | { configValue: unknown; plusConfigFile: PlusConfigFile } {
  const val = getVal(configName, plusConfigFile)
  if (val) return val
  for (const extendsConfig of plusConfigFile.extendsConfigs) {
    const val = getVal(configName, extendsConfig)
    if (val) return val
  }
  return null
}

function getPageConfigValues(plusConfigFile: PlusConfigFile): Record<string, unknown> {
  const { plusConfigFilePath, plusConfigFileExports } = plusConfigFile
  assertDefaultExportObject(plusConfigFileExports, plusConfigFilePath)
  const configValues = plusConfigFileExports.default
  return configValues
}

// TODO:
//  - recursion
//  - ensure no infite loop
//function getVa( configName: string, plusConfigFile: PlusConfigFile, alreadyCheck: string[]): null | { configValue: unknown } {}
function getVal(configName: string, plusConfigFile: PlusConfigFile) {
  const configValues = getPageConfigValues(plusConfigFile)
  if (configName in configValues) {
    const configValue = configValues[configName]
    return { configValue, plusConfigFile }
  }
  return null
}
