export { getConfigValue }
export { getCodeFilePath }
export { getPageConfig }
export { getConfigValueSource }
export { isConfigDefined }

import { assert, assertUsage } from '../utils.js'
import type { ConfigSource, ConfigValue, ConfigValue2, PageConfig, PageConfigData } from './PageConfig.js'
import type { ConfigNameBuiltIn, ConfigNamePrivate } from './Config.js'
import pc from '@brillout/picocolors'

type ConfigName = ConfigNameBuiltIn | ConfigNamePrivate

function getConfigValue(pageConfig: PageConfigData, configName: ConfigName, type: 'string'): null | string
function getConfigValue(pageConfig: PageConfigData, configName: ConfigName, type: 'boolean'): null | boolean
function getConfigValue(pageConfig: PageConfigData, configName: ConfigName): unknown
function getConfigValue(
  pageConfig: PageConfigData,
  configName: ConfigName,
  type?: 'string' | 'boolean'
): null | unknown {
  const configValue = getValue(pageConfig, configName)
  if (configValue === null) return null
  const { value } = configValue
  if (type) {
    if (isNullish(value)) return null
    const configSource = getConfigValueSource(configValue)
    const typeActual = typeof value
    assertUsage(
      typeActual === type,
      `${configSource} has an invalid type \`${typeActual}\`: is should be a ${type} instead`
    )
  }
  return value
}

function getValue(pageConfig: PageConfigData, configName: ConfigName): null | ConfigValue2 {
  const configValue = pageConfig.configValues2[configName]
  if (!configValue) return null
  return configValue
}

function isConfigDefined(pageConfig: PageConfigData, configName: ConfigName): boolean {
  assert(pageConfig.configElements)
  const configElement = pageConfig.configElements[configName]
  if (!configElement) return false
  const configValue = getValue(pageConfig, configName)
  if (configValue && isNullish(configValue.value)) return false
  return true
}

function getCodeFilePath(pageConfig: PageConfigData, configName: ConfigName): null | string {
  assert(pageConfig.configElements)
  const configElement = pageConfig.configElements[configName]
  if (!configElement) return null
  const configValue = getValue(pageConfig, configName)
  if (configValue && isNullish(configValue.value)) return null
  const { codeFilePath } = configElement
  if (codeFilePath !== null) return codeFilePath
  if (!configValue) return null
  const { value } = configValue
  const configValueSource = getConfigValueSource(configValue)
  assertUsage(
    typeof value === 'string',
    `${configValueSource} has an invalid type \`${typeof value}\`: it should be a string instead`
  )
  assertUsage(false, `${configValueSource} has an invalid value '${value}': it should be a file path instead`)
}

function isNullish(configValue: unknown): boolean {
  return configValue === null || configValue === undefined
}

function getPageConfig(pageId: string, pageConfigs: PageConfig[]): PageConfig {
  const pageConfig = pageConfigs.find((p) => p.pageId === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}

// TODO: remove in favor of getConfigValueSource()
function getConfigSource(configSource: ConfigSource): string {
  const { configSourceFile, configSourceFileExportName, configSourceFileDefaultExportKey } = configSource
  assert(configSourceFile)
  if (configSourceFileDefaultExportKey) {
    assert(configSourceFileDefaultExportKey !== 'default')
    return `${configSourceFile} > \`export default { ${configSourceFileDefaultExportKey} }` as const
  } else {
    if (configSourceFileExportName === '*') {
      return `${configSourceFile} > \`export *\`` as const
    } else if (configSourceFileExportName === 'default') {
      return `${configSourceFile} > \`export default\`` as const
    } else {
      assert(configSourceFileExportName)
      return `${configSourceFile} > \`export { ${configSourceFileExportName} }\`` as const
    }
  }
}

function getConfigValueSource(configValue: ConfigValue2): string {
  const { filePath, fileExportPath } = configValue.definedAt
  return `${pc.bold(filePath)} > ${pc.cyan(fileExportPath)}`
}
