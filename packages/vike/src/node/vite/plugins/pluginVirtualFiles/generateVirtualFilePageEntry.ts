export { generateVirtualFilePageEntry }

import { assert, getDebugInfoStr, getProjectError } from '../../../../utils/assert.js'
import type { PageConfigBuildTime } from '../../../../types/PageConfig.js'
import { parseVirtualFileId, generateVirtualFileId } from '../../../../shared-server-node/virtualFileId.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { extractAssetsAddQuery } from '../../../../shared-server-node/extractAssetsQuery.js'
import { debug } from './debug.js'
import {
  FilesEnv,
  serializeConfigValues,
} from '../../../../shared-server-client/page-configs/serialize/serializeConfigValues.js'
import { handleAssetsManifest_isFixEnabled } from '../build/handleAssetsManifest.js'
import { getConfigValueBuildTime } from '../../../../shared-server-client/page-configs/getConfigValueBuildTime.js'
import { resolveIncludeAssetsImportedByServer } from '../../../../server/runtime/renderPageServer/getPageAssets/retrievePageAssetsProd.js'
import '../../assertEnvVite.js'

async function generateVirtualFilePageEntry(id: string, isDev: boolean): Promise<string> {
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
    if (!pageConfig) {
      // Happens very seldomly and can't reproduce reliably. Some kind of HMR race condition? It still happens as of June 2026 with Cloudflare Workers in developement — but it isn't blocking, reloading the page fixes the issue.
      throw getProjectError(`Outdated request. Try again. ${getDebugInfoStr({ id, pageId })}`)
    }
  }

  const code = getCode(
    pageConfig,
    isForClientSide,
    pageId,
    resolveIncludeAssetsImportedByServer(vikeConfig.config),
    isDev,
  )
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function getCode(
  pageConfig: PageConfigBuildTime,
  isForClientSide: boolean,
  pageId: string,
  includeAssetsImportedByServer: boolean,
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

  if (!handleAssetsManifest_isFixEnabled() && includeAssetsImportedByServer && isForClientSide && !isDev) {
    importStatements.push(
      `import '${extractAssetsAddQuery(generateVirtualFileId({ type: 'page-entry', pageId, isForClientSide: false }))}'`,
    )
  }

  const code = [...importStatements, ...lines].join('\n')
  return code
}
