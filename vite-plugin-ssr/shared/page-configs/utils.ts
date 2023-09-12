export { getConfigValue }
export { getPageConfig }
export { getDefinedAt }

import { assert, assertUsage } from '../utils.js'
import type { ConfigValue, DefinedAtInfo, PageConfig, PageConfigBuildTime } from './PageConfig.js'
import type { ConfigNameBuiltIn } from './Config.js'
import pc from '@brillout/picocolors'
import { getExportPath } from './getExportPath.js'

type ConfigName = ConfigNameBuiltIn

type PageConfigValue = PageConfig | PageConfigBuildTime

// prettier-ignore
function getConfigValue(pageConfig: PageConfigValue, configName: ConfigName, type: 'string'): null | ConfigValue & { value: string }
// prettier-ignore
function getConfigValue(pageConfig: PageConfigValue, configName: ConfigName, type: 'boolean'): null | ConfigValue & { value: boolean }
// prettier-ignore
function getConfigValue(pageConfig: PageConfigValue, configName: ConfigName): null | ConfigValue
// prettier-ignore
function getConfigValue(pageConfig: PageConfigValue, configName: ConfigName, type?: 'string' | 'boolean'): null | ConfigValue {
  const configValue = pageConfig.configValues
    ? pageConfig.configValues[configName]
    : pageConfig.configValueSources[configName]?.[0]
  if (!configValue) return null
  const { value, definedAtInfo } = configValue
  // Enable users to suppress global config values by setting the local config value to null
  if (value === null) return null
  if( type ) assertConfigValueType({ value, definedAtInfo }, type)
  return { value, definedAtInfo }
}

function getPageConfig(pageId: string, pageConfigs: PageConfig[]): PageConfig {
  const pageConfig = pageConfigs.find((p) => p.pageId === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}

function assertConfigValueType(
  { value, definedAtInfo }: { value: unknown; definedAtInfo: DefinedAtInfo },
  type: 'string' | 'boolean'
) {
  assert(value !== null)
  const definedAt = getDefinedAt({ definedAtInfo })
  const typeActual = typeof value
  if (typeActual === type) return
  const valuePrintable = getValuePrintable(value)
  const problem =
    valuePrintable !== null ? (`value ${pc.cyan(valuePrintable)}` as const) : (`type ${pc.cyan(typeActual)}` as const)
  assertUsage(false, `${definedAt} has an invalid ${problem}: is should be a ${pc.cyan(type)} instead`)
}

function getValuePrintable(value: unknown): null | string {
  return ['undefined', 'boolean', 'number', 'string'].includes(typeof value)
    ? // String casting with String() is needed because JSON.stringify(undefined) === undefined
      String(JSON.stringify(value))
    : null
}

function getDefinedAt({ definedAtInfo }: { definedAtInfo: DefinedAtInfo }, append?: 'effect'): string {
  const { filePath, fileExportPath } = definedAtInfo
  let definedAt = filePath
  const exportPath = getExportPath(fileExportPath)
  if (exportPath) {
    definedAt = `${definedAt} > ${pc.cyan(exportPath)}`
  }
  if (append) {
    definedAt = `${definedAt} > (${pc.blue(append)})`
  }
  return definedAt
}
