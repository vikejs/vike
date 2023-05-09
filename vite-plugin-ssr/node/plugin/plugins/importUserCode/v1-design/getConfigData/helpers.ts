// TODO: rename
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

// TODO:
//  - recursion
//  - ensure no infite loop
//function getVa( configName: string, plusConfigFile: PlusConfigFile, alreadyCheck: string[]): null | { configValue: unknown } {}
function getVal(configName: string, plusConfigFile: PlusConfigFile) {
  const pageConfigValues = getPageConfigValues(plusConfigFile)
  if (configName in pageConfigValues) {
    const configValue = pageConfigValues[configName]
    return { configValue, plusConfigFile }
  }
  return null
}
