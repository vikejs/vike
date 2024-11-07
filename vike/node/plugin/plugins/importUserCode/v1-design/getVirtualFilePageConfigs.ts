export { getVirtualFilePageConfigs }

import type { PageConfigBuildTime, PageConfigGlobalBuildTime } from '../../../../../shared/page-configs/PageConfig'
import { getVirtualFileIdPageConfigValuesAll } from '../../../../shared/virtual-files/virtualFilePageConfigValuesAll'
import { debug } from './debug'
import { getVikeConfig } from './getVikeConfig'
import { isRuntimeEnvMatch } from './isRuntimeEnvMatch'
import { serializeConfigValues } from '../../../../../shared/page-configs/serialize/serializeConfigValues'
import type { ResolvedConfig } from 'vite'

async function getVirtualFilePageConfigs(
  isForClientSide: boolean,
  isDev: boolean,
  id: string,
  isClientRouting: boolean,
  config: ResolvedConfig
): Promise<string> {
  const { pageConfigs, pageConfigGlobal } = await getVikeConfig(config, isDev, { tolerateInvalidConfig: true })
  return getCode(pageConfigs, pageConfigGlobal, isForClientSide, isDev, id, isClientRouting)
}

function getCode(
  pageConfigs: PageConfigBuildTime[],
  pageConfigGlobal: PageConfigGlobalBuildTime,
  isForClientSide: boolean,
  isDev: boolean,
  id: string,
  isClientRouting: boolean
): string {
  const lines: string[] = []
  const importStatements: string[] = []

  lines.push('export const pageConfigsSerialized = [')
  lines.push(getCodePageConfigsSerialized(pageConfigs, isForClientSide, isClientRouting, isDev, importStatements))
  lines.push('];')

  lines.push('export const pageConfigGlobalSerialized = {')
  lines.push(
    getCodePageConfigGlobalSerialized(pageConfigGlobal, isForClientSide, isClientRouting, isDev, importStatements)
  )
  lines.push('};')

  const code = [...importStatements, ...lines].join('\n')
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function getCodePageConfigsSerialized(
  pageConfigs: PageConfigBuildTime[],
  isForClientSide: boolean,
  isClientRouting: boolean,
  isDev: boolean,
  importStatements: string[]
): string {
  const lines: string[] = []

  pageConfigs.forEach((pageConfig) => {
    const { pageId, routeFilesystem, isErrorPage } = pageConfig
    const virtualFileIdPageConfigValuesAll = getVirtualFileIdPageConfigValuesAll(pageId, isForClientSide)
    lines.push(`  {`)
    lines.push(`    pageId: ${JSON.stringify(pageId)},`)
    lines.push(`    isErrorPage: ${JSON.stringify(isErrorPage)},`)
    lines.push(`    routeFilesystem: ${JSON.stringify(routeFilesystem)},`)
    lines.push(`    loadConfigValuesAll: () => import(${JSON.stringify(virtualFileIdPageConfigValuesAll)}),`)
    lines.push(`    configValuesSerialized: {`)
    lines.push(
      ...serializeConfigValues(
        pageConfig,
        importStatements,
        (configEnv) => isRuntimeEnvMatch(configEnv, { isForClientSide, isClientRouting, isDev }),
        { isEager: true },
        '    '
      )
    )
    lines.push(`    },`)
    lines.push(`  },`)
  })

  const code = lines.join('\n')
  return code
}

function getCodePageConfigGlobalSerialized(
  pageConfigGlobal: PageConfigGlobalBuildTime,
  isForClientSide: boolean,
  isClientRouting: boolean,
  isDev: boolean,
  importStatements: string[]
) {
  const lines: string[] = []

  lines.push(`  configValuesSerialized: {`)
  lines.push(
    ...serializeConfigValues(
      pageConfigGlobal,
      importStatements,
      (configEnv) => isRuntimeEnvMatch(configEnv, { isForClientSide, isClientRouting, isDev }),
      { isEager: true },
      '    '
    )
  )
  lines.push(`  },`)

  const code = lines.join('\n')
  return code
}
