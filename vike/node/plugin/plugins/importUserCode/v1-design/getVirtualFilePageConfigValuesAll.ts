export { getVirtualFilePageConfigValuesAll }

import { assert } from '../../../utils.js'
import type {
  ConfigEnvInternal,
  ConfigValueSource,
  PageConfigBuildTime
} from '../../../../../shared/page-configs/PageConfig.js'
import {
  getVirtualFileIdPageConfigValuesAll,
  isVirtualFileIdPageConfigValuesAll
} from '../../../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
import { getVikeConfig } from './getVikeConfig.js'
import { debug } from './debug.js'
import { getConfigValue } from '../../../../../shared/page-configs/helpers.js'
import { getConfigValueSourcesNotOverriden } from '../../../shared/getConfigValueSourcesNotOverriden.js'
import { isRuntimeEnvMatch } from './isRuntimeEnvMatch.js'
import { serializeConfigValueImported } from '../../../../../shared/page-configs/serialize/serializeConfigValue.js'
import type { ResolvedConfig } from 'vite'
import { getConfigVike } from '../../../../shared/getConfigVike.js'
import { getConfigValuesSerialized } from './getConfigValuesSerialized.js'

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
  const importStatements: string[] = []
  const isClientRouting = getConfigValue(pageConfig, 'clientRouting', 'boolean')?.value ?? false

  lines.push('export const configValuesImported = [')
  lines.push(getConfigValuesImported(pageConfig, isForClientSide, isClientRouting, importStatements))
  lines.push('];')

  lines.push('export const configValuesSerialized = {')
  lines.push(
    getConfigValuesSerialized(pageConfig, (configEnv, configValueSource) =>
      isEnvMatch(configEnv, !configValueSource ? false : checkWhetherIsImport(configValueSource), {
        isImport: false,
        isForClientSide,
        isClientRouting
      })
    )
  )
  lines.push('};')

  const code = [...importStatements, ...lines].join('\n')
  return code
}

function getConfigValuesImported(
  pageConfig: PageConfigBuildTime,
  isForClientSide: boolean,
  isClientRouting: boolean,
  importStatements: string[]
): string {
  const lines: string[] = []
  const varCounterContainer = { varCounter: 0 }

  getConfigValueSourcesNotOverriden(pageConfig).forEach((configValueSource) => {
    if (
      !isEnvMatch(configValueSource.configEnv, checkWhetherIsImport(configValueSource), {
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

  const code = lines.join('\n')
  return code
}

function checkWhetherIsImport(configValueSource: ConfigValueSource) {
  const { valueIsImportedAtRuntime, valueIsFilePath } = configValueSource
  return valueIsImportedAtRuntime && !valueIsFilePath
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
