export { getConfigValue }
export { getPageConfig }
export { getValueSrc }
export { assertConfigValueType }

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
  if (isNullish(value)) return null
  assertConfigValueType({ value, definedAtInfo }, type)
  return { value, definedAtInfo }
}

function isNullish(configValue: unknown): boolean {
  return (
    configValue === null ||
    // TODO: stop allowing users to set undefined and, instead, force them to use `null`?
    configValue === undefined
  )
}

function getPageConfig(pageId: string, pageConfigs: PageConfig[]): PageConfig {
  const pageConfig = pageConfigs.find((p) => p.pageId === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}

function assertConfigValueType(
  { value, definedAtInfo }: { value: unknown; definedAtInfo: DefinedAtInfo },
  type: undefined | 'string' | 'boolean'
) {
  if (type === undefined) return
  assert(value !== null)
  const valueSrc = getValueSrc({ definedAtInfo })
  const typeActual = typeof value
  assertUsage(
    typeActual === type,
    `${valueSrc} has an invalid type ${pc.cyan(typeActual)}: is should be a ${pc.cyan(type)} instead`
  )
}

function getValueSrc({ definedAtInfo }: { definedAtInfo: DefinedAtInfo }, append?: 'effect'): string {
  const { filePath, fileExportPath } = definedAtInfo
  let valueSrc = filePath
  const exportPath = getExportPath(fileExportPath)
  if (exportPath) {
    valueSrc = `${valueSrc} > ${pc.cyan(exportPath)}`
  }
  if (append) {
    valueSrc = `${valueSrc} > (${pc.blue(append)})`
  }
  return valueSrc
}
