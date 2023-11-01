export { getConfigValue }
export { getPageConfig }

export { getConfigDefinedAtString }
export { getDefinedAtString }

export { getConfigValueFilePathToShowToUser }
export { getHookFilePathToShowToUser }

import { assert, assertUsage, getValuePrintable } from '../utils.js'
import type { PageConfigRuntime, PageConfigBuildTime, ConfigValue, DefinedAt, DefinedAtFile } from './PageConfig.js'
import type { ConfigNameBuiltIn } from './Config.js'
import pc from '@brillout/picocolors'
import { getExportPath } from './getExportPath.js'

type PageConfigCommon = PageConfigRuntime | PageConfigBuildTime
type ConfigName = ConfigNameBuiltIn

// prettier-ignore
function getConfigValue(pageConfig: PageConfigCommon, configName: ConfigName, type: 'string'): null | ConfigValue & { value: string }
// prettier-ignore
function getConfigValue(pageConfig: PageConfigCommon, configName: ConfigName, type: 'boolean'): null | ConfigValue & { value: boolean }
// prettier-ignore
function getConfigValue(pageConfig: PageConfigCommon, configName: ConfigName): null | ConfigValue & { value: unknown }
// prettier-ignore
function getConfigValue(pageConfig: PageConfigCommon, configName: ConfigName, type?: 'string' | 'boolean'): null | ConfigValue & { value: unknown } {
  const configValue = getConfigValueEntry(pageConfig, configName)
  if (configValue === null) return null
  const { value, definedAt } = configValue
  if (type) assertConfigValueType(value, type, configName, definedAt)
  return configValue
}

function assertConfigValueType(value: unknown, type: 'string' | 'boolean', configName: string, definedAt: DefinedAt) {
  assert(value !== null)
  const typeActual = typeof value
  if (typeActual === type) return
  const valuePrintable = getValuePrintable(value)
  const problem: string =
    valuePrintable !== null
      ? (`value ${pc.cyan(valuePrintable)}` as const)
      : (`type ${pc.cyan(typeActual) as string}` as const)
  const configDefinedAt: `Config ${string} defined ${string}` = getConfigDefinedAtString('Config', configName, {
    definedAt
  })
  const errMsg = `${configDefinedAt} has an invalid ${problem}: it should be a ${
    pc.cyan(type) as string
  } instead` as const
  assertUsage(false, errMsg)
}

function getConfigValueEntry(pageConfig: PageConfigCommon, configName: ConfigName) {
  const configValue = pageConfig.configValues[configName]
  if (!configValue) return null
  // Enable users to suppress global config values by setting the local config value to null
  if (configValue.value === null) return null
  return configValue
}

function getPageConfig(pageId: string, pageConfigs: PageConfigRuntime[]): PageConfigRuntime {
  const pageConfig = pageConfigs.find((p) => p.pageId === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}

function getConfigDefinedAtString<ConfigName extends string, SentenceBegin extends 'Config' | 'config' | 'Hook'>(
  sentenceBegin: SentenceBegin,
  configName: ConfigName,
  { definedAt }: { definedAt: DefinedAt }
): `${SentenceBegin} ${ConfigName}${string} defined ${'internally' | `at ${string}`}` {
  const definedAtString = getDefinedAtString(definedAt, configName)
  const definedAtStr = definedAtString === 'internally' ? definedAtString : (`at ${definedAtString}` as const)
  let configNameStr: `${ConfigName}${string}` = `${configName}${sentenceBegin === 'Hook' ? '()' : ''}`
  const configDefinedAt = `${sentenceBegin} ${pc.cyan(configNameStr)} defined ${definedAtStr}` as const
  return configDefinedAt
}
function getDefinedAtString(definedAt: DefinedAt, configName: string): string {
  if ('isComputed' in definedAt) {
    return 'internally'
  }

  let files: DefinedAtFile[]
  if ('files' in definedAt) {
    files = definedAt.files
  } else {
    files = [definedAt]
  }

  assert(files.length >= 1)
  const definedAtString = files
    .map((source) => {
      const { filePathToShowToUser, fileExportPathToShowToUser } = source
      let s = filePathToShowToUser
      const exportPath = getExportPath(fileExportPathToShowToUser, configName)
      if (exportPath) {
        s = `${s} > ${pc.cyan(exportPath)}`
      }
      return s
    })
    .join(' / ')
  return definedAtString
}

function getConfigValueFilePathToShowToUser({ definedAt }: { definedAt: DefinedAt }): null | string {
  // A unique file path only exists if the config value isn't cumulative nor computed:
  //  - cumulative config values have multiple file paths
  //  - computed values don't have any file path
  if ('isComputed' in definedAt || 'files' in definedAt) return null
  const { filePathToShowToUser } = definedAt
  assert(filePathToShowToUser)
  return filePathToShowToUser
}

function getHookFilePathToShowToUser({ definedAt }: { definedAt: DefinedAt }): string {
  const filePathToShowToUser = getConfigValueFilePathToShowToUser({ definedAt })
  assert(filePathToShowToUser)
  return filePathToShowToUser
}
