export { getVirtualFilePageConfigValuesAll }

import { assert } from '../../../utils.js'
import type { ConfigEnvInternal, PageConfigBuildTime } from '../../../../../shared/page-configs/PageConfig.js'
import {
  getVirtualFileIdPageConfigValuesAll,
  isVirtualFileIdPageConfigValuesAll
} from '../../../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
import { getVikeConfig } from './getVikeConfig.js'
import { extractAssetsAddQuery } from '../../../../shared/extractAssetsQuery.js'
import { debug } from './debug.js'
import { getConfigValue } from '../../../../../shared/page-configs/helpers.js'
import { getConfigValueSourcesRelevant } from '../../../shared/getConfigValueSourcesRelevant.js'
import { isRuntimeEnvMatch } from './isRuntimeEnvMatch.js'
import {
  serializeConfigValue,
  serializeConfigValueImported
} from '../../../../../shared/page-configs/serialize/serializeConfigValue.js'
import type { ResolvedConfig } from 'vite'
import { getConfigVike } from '../../../../shared/getConfigVike.js'
import { getConfigValueSerialized } from './getVirtualFilePageConfigs.js'

async function getVirtualFilePageConfigValuesAll(id: string, isDev: boolean, config: ResolvedConfig): Promise<string> {
  const result = isVirtualFileIdPageConfigValuesAll(id)
  assert(result)
  /* This assertion fails when using includeAssetsImportedByServer
  {
    const isForClientSide = !config.build.ssr
    assert(result.isForClientSide === isForClientSide)
  }
  */
  const { pageId, isForClientSide } = result
  const { pageConfigs } = await getVikeConfig(config, isDev, true)
  const pageConfig = pageConfigs.find((pageConfig) => pageConfig.pageId === pageId)
  assert(pageConfig)
  const configVike = await getConfigVike(config)
  const code = getLoadConfigValuesAll(
    pageConfig,
    isForClientSide,
    pageId,
    configVike.includeAssetsImportedByServer,
    isDev
  )
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function getLoadConfigValuesAll(
  pageConfig: PageConfigBuildTime,
  isForClientSide: boolean,
  pageId: string,
  includeAssetsImportedByServer: boolean,
  isDev: boolean
): string {
  const lines: string[] = []
  const configValue = getConfigValue(pageConfig, 'clientRouting', 'boolean')
  const isClientRouting = configValue?.value ?? false

  lines.push(
    getConfigValuesImported(pageConfig, isForClientSide, isClientRouting, pageId, includeAssetsImportedByServer, isDev)
  )
  lines.push(getConfigValuesSerialized(pageConfig, isForClientSide, isClientRouting))

  const code = lines.join('\n')
  return code
}

function getConfigValuesImported(
  pageConfig: PageConfigBuildTime,
  isForClientSide: boolean,
  isClientRouting: boolean,
  pageId: string,
  includeAssetsImportedByServer: boolean,
  isDev: boolean
): string {
  const lines: string[] = []
  const importStatements: string[] = []
  const varCounterContainer = { varCounter: 0 }

  lines.push('export const configValuesImported = [')
  getConfigValueSourcesRelevant(pageConfig).forEach((configValueSource) => {
    const { configEnv, valueIsImportedAtRuntime, valueIsFilePath } = configValueSource
    if (
      !isEnvMatch(configEnv, valueIsImportedAtRuntime && !valueIsFilePath, {
        isImport: true,
        isForClientSide,
        isClientRouting
      })
    )
      return
    const whitespace = '  '
    lines.push(
      ...serializeConfigValueImported(
        configValueSource,
        configValueSource.configName,
        whitespace,
        varCounterContainer,
        importStatements
      )
    )
  })
  lines.push('];')

  if (includeAssetsImportedByServer && isForClientSide && !isDev) {
    lines.push(`import '${extractAssetsAddQuery(getVirtualFileIdPageConfigValuesAll(pageId, false))}'`)
  }

  const code = [...importStatements, ...lines].join('\n')
  return code
}

function getConfigValuesSerialized(
  pageConfig: PageConfigBuildTime,
  isForClientSide: boolean,
  isClientRouting: boolean
): string {
  const lines: string[] = []
  const configValueSources = getConfigValueSourcesRelevant(pageConfig)

  lines.push('export const configValuesSerialized = {')
  Object.entries(pageConfig.configValuesComputed).forEach(([configName, configValuesComputed]) => {
    const { value, configEnv } = configValuesComputed

    if (!isEnvMatch(configEnv, false, { isImport: false, isForClientSide, isClientRouting })) return
    // configValeSources has higher precedence
    if (pageConfig.configValueSources[configName]) return

    const configValue = pageConfig.configValues[configName]
    assert(configValue)
    const { definedAt } = configValue
    const valueSerialized = getConfigValueSerialized(value, configName, definedAt)
    serializeConfigValue(lines, configName, { definedAt, valueSerialized })
  })
  configValueSources.forEach((configValueSource) => {
    const { configName, configEnv, valueIsImportedAtRuntime, valueIsFilePath } = configValueSource
    const configValue = pageConfig.configValues[configName]

    if (!configValue) return
    if (
      !isEnvMatch(configEnv, valueIsImportedAtRuntime && !valueIsFilePath, {
        isImport: false,
        isForClientSide,
        isClientRouting
      })
    )
      return

    const { value, definedAt } = configValue
    const valueSerialized = getConfigValueSerialized(value, configName, definedAt)
    serializeConfigValue(lines, configName, { definedAt, valueSerialized })
  })
  lines.push('};')

  const code = lines.join('\n')
  return code
}

function isEnvMatch(
  configEnv: ConfigEnvInternal,
  isImport: boolean,
  runtime: {
    isImport: boolean
    isForClientSide: boolean
    isClientRouting: boolean
  }
): boolean {
  // Whether config value is imported or serialized
  if (isImport !== runtime.isImport) return false

  // Runtime match
  const { isForClientSide, isClientRouting } = runtime
  if (!isRuntimeEnvMatch(configEnv, { isForClientSide, isClientRouting, isEager: false })) return false

  return true
}
