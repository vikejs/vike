export { getConfigValue }
export { getCodeFilePath }
export { getPageConfig }
export { getConfigSource }

import { assert, assertUsage } from '../utils.js'
import type { ConfigSource, ConfigValue, PageConfig, PageConfigData } from './PageConfig.js'
import type { ConfigNameBuiltIn, ConfigNamePrivate } from './Config.js'

type ConfigName = ConfigNameBuiltIn | ConfigNamePrivate

function getConfigValue(pageConfig: PageConfigData, configName: ConfigName, type: 'string'): null | string
function getConfigValue(pageConfig: PageConfigData, configName: ConfigName, type: 'boolean'): null | boolean
function getConfigValue(pageConfig: PageConfigData, configName: ConfigName): unknown
function getConfigValue(
  pageConfig: PageConfigData,
  configName: ConfigName,
  type?: 'string' | 'boolean'
): null | unknown {
  const v = getV(pageConfig, configName)
  if (v === null) return null
  const { configValue } = v
  if (type) {
    if (isNullish(configValue)) return null
    const configSource = getConfigSource(v)
    const typeActual = typeof configValue
    assertUsage(
      typeActual === type,
      `${configSource} has an invalid type \`${typeActual}\`: is should be a ${type} instead`
    )
  }
  return configValue
}

function getV(pageConfig: PageConfigData, configName: ConfigName): null | ConfigValue {
  const v = pageConfig.configValues[configName]
  if (!v) {
    assert(!pageConfig.configElements[configName])
    return null
  }
  return v
}

function getCodeFilePath(pageConfig: PageConfigData, configName: ConfigName): null | string {
  const v = getV(pageConfig, configName)
  if (v === null) return null
  const { configValue } = v
  const configSource = getConfigSource(v)
  const configElement = pageConfig.configElements[configName]
  if (!configElement) return null
  const { codeFilePath } = configElement
  if (codeFilePath !== null) return codeFilePath
  if (isNullish(configValue)) return null
  assertUsage(
    typeof configValue === 'string',
    `${configSource} has an invalid type \`${typeof configValue}\`: it should be a string instead`
  )
  assertUsage(false, `${configSource} has an invalid value '${configValue}': it should be a file path instead`)
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
