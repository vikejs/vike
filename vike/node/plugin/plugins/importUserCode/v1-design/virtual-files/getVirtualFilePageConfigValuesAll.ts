export { getVirtualFilePageConfigValuesAll }

import { assert } from '../../../../utils.js'
import type { PageConfigBuildTime } from '../../../../../../shared/page-configs/PageConfig.js'
import {
  getVirtualFileIdPageConfigValuesAll,
  isVirtualFileIdPageConfigValuesAll
} from '../../../../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
import { getVikeConfig } from '../getVikeConfig.js'
import { extractAssetsAddQuery } from '../../../../../shared/extractAssetsQuery.js'
import { debug } from './debug.js'
import { isRuntimeEnvMatch } from './isRuntimeEnvMatch.js'
import {
  FilesEnv,
  serializeConfigValues
} from '../../../../../../shared/page-configs/serialize/serializeConfigValues.js'
import type { ResolvedConfig } from 'vite'
import { fixServerAssets_isEnabled } from '../../../build/pluginAssetsManifest/fixServerAssets.js'
import { getConfigValueBuildTime } from '../../../../../../shared/page-configs/getConfigValueBuildTime.js'

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
  const vikeConfig = await getVikeConfig(config, { doNotRestartViteOnError: true })
  const { pageConfigs } = vikeConfig
  const pageConfig = pageConfigs.find((pageConfig) => pageConfig.pageId === pageId)
  assert(pageConfig, { id, pageId })
  const code = getLoadConfigValuesAll(
    pageConfig,
    isForClientSide,
    pageId,
    // TODO/now: add meta.default
    vikeConfig.global.config.includeAssetsImportedByServer ?? true,
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

  if (!fixServerAssets_isEnabled() && includeAssetsImportedByServer && isForClientSide && !isDev) {
    importStatements.push(`import '${extractAssetsAddQuery(getVirtualFileIdPageConfigValuesAll(pageId, false))}'`)
  }

  const code = [...importStatements, ...lines].join('\n')
  return code
}
