export { getVirtualFilePageConfigValuesAll }

import { assert } from '../../../utils.js'
import type { PageConfigBuildTime } from '../../../../../shared/page-configs/PageConfig.js'
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
import { serializeConfigValueImported } from '../../../../../shared/page-configs/serialize/serializeConfigValue.js'
import type { ResolvedConfig } from 'vite'
import { getConfigVike } from '../../../../shared/getConfigVike.js'

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
  const configValue = getConfigValue(pageConfig, 'clientRouting', 'boolean')
  const isClientRouting = configValue?.value ?? false
  const lines: string[] = []
  const importStatements: string[] = []
  lines.push('export default [')
  const varCounterContainer = { varCounter: 0 }
  getConfigValueSourcesRelevant(pageConfig).forEach((configValueSource) => {
    const { valueIsImportedAtRuntime, configEnv, configName } = configValueSource

    if (!valueIsImportedAtRuntime) return
    if (configValueSource.valueIsFilePath) return
    if (!isRuntimeEnvMatch(configEnv, { isForClientSide, isClientRouting, isEager: false })) return

    const whitespace = '  '
    lines.push(
      ...serializeConfigValueImported(configValueSource, configName, whitespace, varCounterContainer, importStatements)
    )
  })
  lines.push('];')
  if (includeAssetsImportedByServer && isForClientSide && !isDev) {
    lines.push(`import '${extractAssetsAddQuery(getVirtualFileIdPageConfigValuesAll(pageId, false))}'`)
  }
  const code = [...importStatements, ...lines].join('\n')
  return code
}
