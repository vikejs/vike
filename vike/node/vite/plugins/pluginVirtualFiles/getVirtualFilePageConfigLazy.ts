export { getVirtualFilePageConfigLazy }

import { assert } from '../../utils.js'
import type { PageConfigBuildTime } from '../../../../types/PageConfig.js'
import {
  getVirtualFileIdPageConfigLazy,
  isVirtualFileIdPageConfigLazy
} from '../../../shared/virtualFiles/virtualFilePageConfigLazy.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfig.js'
import { extractAssetsAddQuery } from '../../../shared/extractAssetsQuery.js'
import { debug } from './debug.js'
import { isRuntimeEnvMatch } from './isRuntimeEnvMatch.js'
import { FilesEnv, serializeConfigValues } from '../../../../shared/page-configs/serialize/serializeConfigValues.js'
import type { ResolvedConfig } from 'vite'
import { handleAssetsManifest_isFixEnabled } from '../pluginBuild/handleAssetsManifest.js'
import { getConfigValueBuildTime } from '../../../../shared/page-configs/getConfigValueBuildTime.js'
import { resolveIncludeAssetsImportedByServer } from '../../../runtime/renderPage/getPageAssets.js'

async function getVirtualFilePageConfigLazy(id: string, isDev: boolean, config: ResolvedConfig): Promise<string> {
  const result = isVirtualFileIdPageConfigLazy(id)
  assert(result)
  /* This assertion fails when using includeAssetsImportedByServer
  {
    const isForClientSide = !config.build.ssr
    assert(result.isForClientSide === isForClientSide)
  }
  */
  const { pageId, isForClientSide } = result
  const vikeConfig = await getVikeConfigInternal(true)
  const { _pageConfigs: pageConfigs } = vikeConfig
  const pageConfig = pageConfigs.find((pageConfig) => pageConfig.pageId === pageId)
  assert(pageConfig, { id, pageId })
  const code = getLoadConfigLazy(
    pageConfig,
    isForClientSide,
    pageId,
    resolveIncludeAssetsImportedByServer(vikeConfig.config),
    config,
    isDev
  )
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function getLoadConfigLazy(
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
    importStatements.push(`import '${extractAssetsAddQuery(getVirtualFileIdPageConfigLazy(pageId, false))}'`)
  }

  const code = [...importStatements, ...lines].join('\n')
  return code
}
