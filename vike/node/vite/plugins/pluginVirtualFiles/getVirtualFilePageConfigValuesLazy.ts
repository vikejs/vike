export { getVirtualFilePageConfigValuesLazy }

import { assert } from '../../utils.js'
import type { PageConfigBuildTime } from '../../../../shared/page-configs/PageConfig.js'
import {
  getVirtualFileIdPageConfigValuesLazy,
  isVirtualFileIdPageConfigValuesLazy
} from '../../../shared/virtualFiles/virtualFilePageConfigValuesLazy.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfig.js'
import { extractAssetsAddQuery } from '../../../shared/extractAssetsQuery.js'
import { debug } from './debug.js'
import { isRuntimeEnvMatch } from './isRuntimeEnvMatch.js'
import { FilesEnv, serializeConfigValues } from '../../../../shared/page-configs/serialize/serializeConfigValues.js'
import type { ResolvedConfig } from 'vite'
import { handleAssetsManifest_isFixEnabled } from '../build/handleAssetsManifest.js'
import { getConfigValueBuildTime } from '../../../../shared/page-configs/getConfigValueBuildTime.js'

async function getVirtualFilePageConfigValuesLazy(id: string, isDev: boolean, config: ResolvedConfig): Promise<string> {
  const result = isVirtualFileIdPageConfigValuesLazy(id)
  assert(result)
  /* This assertion fails when using includeAssetsImportedByServer
  {
    const isForClientSide = !config.build.ssr
    assert(result.isForClientSide === isForClientSide)
  }
  */
  const { pageId, isForClientSide } = result
  const vikeConfig = await getVikeConfigInternal(true)
  const { pageConfigs } = vikeConfig
  const pageConfig = pageConfigs.find((pageConfig) => pageConfig.pageId === pageId)
  assert(pageConfig, { id, pageId })
  const code = getLoadConfigValuesLazy(
    pageConfig,
    isForClientSide,
    pageId,
    // TODO/now: add meta.default
    vikeConfig.global.config.includeAssetsImportedByServer ?? true,
    config,
    isDev
  )
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function getLoadConfigValuesLazy(
  pageConfig: PageConfigBuildTime,
  isForClientSide: boolean,
  pageId: string,
  includeAssetsImportedByServer: boolean,
  config: ResolvedConfig,
  isDev: boolean
): string {
  const lines: string[] = []
  const importStatements: string[] = []
  const filesEnv: FilesEnv = new Map()
  const isClientRouting = getConfigValueBuildTime(pageConfig, 'clientRouting', 'boolean')?.value ?? false

  lines.push('export const configValuesSerialized = {')
  lines.push(
    ...serializeConfigValues(
      pageConfig,
      importStatements,
      filesEnv,
      (configEnv) => isRuntimeEnvMatch(configEnv, { isForClientSide, isClientRouting, isDev }),
      '',
      false
    )
  )
  lines.push('};')

  if (!handleAssetsManifest_isFixEnabled(config) && includeAssetsImportedByServer && isForClientSide && !isDev) {
    importStatements.push(`import '${extractAssetsAddQuery(getVirtualFileIdPageConfigValuesLazy(pageId, false))}'`)
  }

  const code = [...importStatements, ...lines].join('\n')
  return code
}
