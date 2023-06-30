export { getConfigValue }
export { getCodeFilePath }
export { getPageConfig }
export { getConfigSource }
export { isConfigDefined }

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
  const vs = pageConfig.configValues.filter((v) => v.configName === configName)
  assert(vs.length <= 1) // Conflicts are already handled upstream
  const v = vs[0]
  if (pageConfig.configElements && v) {
    assert(!!pageConfig.configElements[configName])
  }
  return v ?? null
}

function isConfigDefined(pageConfig: PageConfigData, configName: ConfigName): boolean {
  assert(pageConfig.configElements)
  const configElement = pageConfig.configElements[configName]
  if (!configElement) return false
  const v = getV(pageConfig, configName)
  if (v && isNullish(v)) return false
  return true
}

function getCodeFilePath(pageConfig: PageConfigData, configName: ConfigName): null | string {
  assert(pageConfig.configElements)
  const configElement = pageConfig.configElements[configName]
  if (!configElement) return null
  const v = getV(pageConfig, configName)
  if (v && isNullish(v)) return null
  const { codeFilePath } = configElement
  if (codeFilePath !== null) return codeFilePath
  if (!v) return null
  const { configValue } = v
  const configSource = getConfigSource(v)
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
