export { getConfigValue }
export { getConfigValue2 }
export { getPageConfig }
export { getConfigSrc }

import { assert, assertUsage } from '../utils.js'
import type { ConfigSource, ConfigValue, PageConfig, PageConfigData } from './PageConfig.js'
import type { ConfigNameBuiltIn, ConfigNamePrivate } from './Config.js'
import pc from '@brillout/picocolors'
import { getExportPath } from './getExportPath.js'

type ConfigName = ConfigNameBuiltIn | ConfigNamePrivate

// TODO: remove in favor of getConfigValue2()
function getConfigValue(pageConfig: PageConfigData, configName: ConfigName, type: 'string'): null | string
function getConfigValue(pageConfig: PageConfigData, configName: ConfigName, type: 'boolean'): null | boolean
function getConfigValue(pageConfig: PageConfigData, configName: ConfigName): unknown
function getConfigValue(
  pageConfig: PageConfigData,
  configName: ConfigName,
  type?: 'string' | 'boolean'
): null | unknown {
  const configValue = getConfigValue2(pageConfig, configName, type as any)
  if (!configValue) return null
  return configValue.value
}

// prettier-ignore
function getConfigValue2(pageConfig: PageConfigData, configName: ConfigName, type: 'string'): null | ConfigValue & { value: string }
// prettier-ignore
function getConfigValue2(pageConfig: PageConfigData, configName: ConfigName, type: 'boolean'): null | ConfigValue & { value: boolean }
// prettier-ignore
function getConfigValue2(pageConfig: PageConfigData, configName: ConfigName): null | ConfigValue
// prettier-ignore
function getConfigValue2(pageConfig: PageConfigData, configName: ConfigName, type?: 'string' | 'boolean'): null | ConfigValue {
  const configValue = pageConfig.configValues[configName]
  if (!configValue) return null
  const { value } = configValue
  if (type) {
    if (isNullish(value)) return null
    const configSrc = getConfigSrc(configValue)
    const typeActual = typeof value
    assertUsage(
      typeActual === type,
      `${configSrc} has an invalid type \`${typeActual}\`: is should be a ${type} instead`
    )
  }
  return configValue
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

// TODO: rename to getValueSrc()
function getConfigSrc(
  { definedAt }: { definedAt: { filePath: string; fileExportPath: string[] } },
  append?: 'effect'
): string {
  const { filePath, fileExportPath } = definedAt
  const exportPath = getExportPath(fileExportPath)
  let configSrc = `${pc.bold(filePath)} > ${pc.cyan(exportPath)}`
  if (append) {
    configSrc = `${configSrc} > (${pc.blue(append)})`
  }
  return configSrc
}
