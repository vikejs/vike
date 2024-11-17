export { getVirtualFilePageConfigValuesAll }

import { assert } from '../../../utils'
import type { PageConfigBuildTime } from '../../../../../shared/page-configs/PageConfig'
import {
  getVirtualFileIdPageConfigValuesAll,
  isVirtualFileIdPageConfigValuesAll
} from '../../../../shared/virtual-files/virtualFilePageConfigValuesAll'
import { getVikeConfig } from './getVikeConfig'
import { extractAssetsAddQuery } from '../../../../shared/extractAssetsQuery'
import { debug } from './debug'
import { isRuntimeEnvMatch } from './isRuntimeEnvMatch'
import { serializeConfigValues } from '../../../../../shared/page-configs/serialize/serializeConfigValues'
import type { ResolvedConfig } from 'vite'
import { getConfigVike } from '../../../../shared/getConfigVike'
import { fixServerAssets_isEnabled } from '../../buildConfig/fixServerAssets'
import { getConfigValueBuildTime } from '../../../../../shared/page-configs/getConfigValueBuildTime'

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
  const { pageConfigs } = await getVikeConfig(config, isDev, { tolerateInvalidConfig: true })
  const pageConfig = pageConfigs.find((pageConfig) => pageConfig.pageId === pageId)
  assert(pageConfig, { id, pageId })
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
  const isClientRouting = getConfigValueBuildTime(pageConfig, 'clientRouting', 'boolean')?.value ?? false

  lines.push('export const configValuesSerialized = {')
  lines.push(
    ...serializeConfigValues(
      pageConfig,
      importStatements,
      (configEnv) => isRuntimeEnvMatch(configEnv, { isForClientSide, isClientRouting, isDev }),
      { isEager: false },
      ''
    )
  )
  lines.push('};')

  if (!fixServerAssets_isEnabled() && includeAssetsImportedByServer && isForClientSide && !isDev) {
    importStatements.push(`import '${extractAssetsAddQuery(getVirtualFileIdPageConfigValuesAll(pageId, false))}'`)
  }

  const code = [...importStatements, ...lines].join('\n')
  return code
}
