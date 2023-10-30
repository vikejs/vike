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
  const problem =
    valuePrintable !== null ? (`value ${pc.cyan(valuePrintable)}` as const) : (`type ${pc.cyan(typeActual)}` as const)
  const configDefinedAt = getConfigDefinedAtString(configName, { definedAt }, true)
  assertUsage(false, `${configDefinedAt} has an invalid ${problem}: it should be a ${pc.cyan(type)} instead`)
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

// TODO: support sentences:
//  - "Hook defined at ..." and use it at loadPageRoutes()
//  - "Effect ${configNameEffect} of config ${configNameSource} ..." and use it at loadPageRoutes()
//    ~~- Do we really need `append: 'effect'`?~~ EDIT: yes we do
//  - Restore implementation of append option?
//  - Review/refactor getSourceString()
type ConfigDefinedAtUppercase<ConfigName extends string> = `Config ${ConfigName} defined ${
  | 'internally'
  | `at ${string}`}`
type ConfigDefinedAtLowercase<ConfigName extends string> = `config ${ConfigName} defined ${
  | 'internally'
  | `at ${string}`}`
function getConfigDefinedAtString<ConfigName extends string>(
  configName: ConfigName,
  { definedAt }: { definedAt: DefinedAt },
  sentenceBegin: true,
): ConfigDefinedAtUppercase<ConfigName>
function getConfigDefinedAtString<ConfigName extends string>(
  configName: ConfigName,
  { definedAt }: { definedAt: DefinedAt },
  sentenceBegin: false,
): ConfigDefinedAtLowercase<ConfigName>
function getConfigDefinedAtString<ConfigName extends string>(
  configName: ConfigName,
  { definedAt }: { definedAt: DefinedAt },
  sentenceBegin: boolean
): ConfigDefinedAtUppercase<ConfigName> | ConfigDefinedAtLowercase<ConfigName> {
  const definedAtString = getDefinedAtString(definedAt, configName)
  const definedAtStr = definedAtString === 'internally' ? definedAtString : (`at ${definedAtString}` as const)
  const configDefinedAt = `${sentenceBegin ? `Config` : `config`} ${pc.cyan(
    configName
  )} defined ${definedAtStr}` as const
  return configDefinedAt
}
function getDefinedAtString(definedAt: DefinedAt, configName: string): string {
  if (definedAt.isComputed) {
    return 'internally'
  }

  let files: DefinedAtFile[]
  if (definedAt.isCumulative) {
    files = definedAt.files
  } else {
    files = [definedAt.file]
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
      if (definedAt.isEffect) {
        s = `${s} > (${pc.blue('effect')})`
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
  if (definedAt.isComputed || definedAt.isCumulative) return null
  const { filePathToShowToUser } = definedAt.file
  assert(filePathToShowToUser)
  return filePathToShowToUser
}

function getHookFilePathToShowToUser({ definedAt }: { definedAt: DefinedAt }): string {
  const filePathToShowToUser = getConfigValueFilePathToShowToUser({ definedAt })
  assert(filePathToShowToUser)
  return filePathToShowToUser
}
