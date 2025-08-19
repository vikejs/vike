export { getVirtualFilePageConfigLazy }

// TODO/now: rename file to generateVirtualFileEntryPage.ts

import { assert, getProjectError } from '../../utils.js'
import type { PageConfigBuildTime } from '../../../../types/PageConfig.js'
import { parseVirtualFileId, generateVirtualFileId } from '../../../shared/virtualFileId.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { extractAssetsAddQuery } from '../../../shared/extractAssetsQuery.js'
import { debug } from './debug.js'
import { FilesEnv, serializeConfigValues } from '../../../../shared/page-configs/serialize/serializeConfigValues.js'
import type { ResolvedConfig } from 'vite'
import { handleAssetsManifest_isFixEnabled } from '../pluginBuild/handleAssetsManifest.js'
import { getConfigValueBuildTime } from '../../../../shared/page-configs/getConfigValueBuildTime.js'
import { resolveIncludeAssetsImportedByServer } from '../../../runtime/renderPage/getPageAssets/retrievePageAssetsProd.js'

async function getVirtualFilePageConfigLazy(id: string, isDev: boolean, config: ResolvedConfig): Promise<string> {
  const result = parseVirtualFileId(id)
  assert(result && result.type === 'page-entry')
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

  if (!isDev) {
    assert(pageConfig)
  } else {
    /* This assertion sometimes fail. It happens very seldom and I couldn't reproduce it (https://gist.github.com/brillout/9e212ce829f4d62a912ca163ffa8881a). I suspect some kind of HMR race condition.
    assert(pageConfig, { id, pageId })
    /*/
    if (!pageConfig) throw getProjectError('Outdated request')
    //*/
  }

  const code = getLoadPageEntry(
    pageConfig,
    isForClientSide,
    pageId,
    resolveIncludeAssetsImportedByServer(vikeConfig.config),
    config,
    isDev,
  )
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function getLoadPageEntry(
  pageConfig: PageConfigBuildTime,
  isForClientSide: boolean,
  pageId: string,
  includeAssetsImportedByServer: boolean,
  config: ResolvedConfig,
  isDev: boolean,
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
      { isForClientSide, isClientRouting, isDev },
      '',
      false,
    ),
  )
  lines.push('};')

  if (!handleAssetsManifest_isFixEnabled(config) && includeAssetsImportedByServer && isForClientSide && !isDev) {
    importStatements.push(
      `import '${extractAssetsAddQuery(generateVirtualFileId({ type: 'page-entry', pageId, isForClientSide: false }))}'`,
    )
  }

  const code = [...importStatements, ...lines].join('\n')
  return code
}
