export { getVirtualFilePageConfigs }

import type {
  PageConfigBuildTime,
  PageConfigGlobalBuildTime
} from '../../../../../../shared/page-configs/PageConfig.js'
import { getVirtualFileIdPageConfigValuesAll } from '../../../../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
import { debug } from './debug.js'
import { getVikeConfig } from '../getVikeConfig.js'
import { isRuntimeEnvMatch } from './isRuntimeEnvMatch.js'
import {
  FilesEnv,
  serializeConfigValues
} from '../../../../../../shared/page-configs/serialize/serializeConfigValues.js'
import type { ResolvedConfig } from 'vite'

async function getVirtualFilePageConfigs(
  isForClientSide: boolean,
  isDev: boolean,
  id: string,
  isClientRouting: boolean,
  config: ResolvedConfig
): Promise<string> {
  const vikeConfig = await getVikeConfig(config, { doNotRestartViteOnError: true })
  const { pageConfigs, pageConfigGlobal } = vikeConfig
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
  const filesEnv: FilesEnv = new Map()

  lines.push('export const pageConfigsSerialized = [')
  lines.push(
    getCodePageConfigsSerialized(pageConfigs, isForClientSide, isClientRouting, isDev, importStatements, filesEnv)
  )
  lines.push('];')

  lines.push('export const pageConfigGlobalSerialized = {')
  lines.push(
    getCodePageConfigGlobalSerialized(
      pageConfigGlobal,
      isForClientSide,
      isClientRouting,
      isDev,
      importStatements,
      filesEnv
    )
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
  importStatements: string[],
  filesEnv: FilesEnv
): string {
  const lines: string[] = []

  pageConfigs.forEach((pageConfig) => {
    const { pageId, routeFilesystem, isErrorPage } = pageConfig
    lines.push(`  {`)
    lines.push(`    pageId: ${JSON.stringify(pageId)},`)
    lines.push(`    isErrorPage: ${JSON.stringify(isErrorPage)},`)
    lines.push(`    routeFilesystem: ${JSON.stringify(routeFilesystem)},`)
    const virtualFileId = JSON.stringify(getVirtualFileIdPageConfigValuesAll(pageId, isForClientSide))
    const load = `() => ({ moduleId: ${virtualFileId}, moduleExports: import(${virtualFileId}) })`
    lines.push(`    loadConfigValuesAll: ${load},`)
    lines.push(`    configValuesSerialized: {`)
    lines.push(
      ...serializeConfigValues(
        pageConfig,
        importStatements,
        filesEnv,
        (configEnv) => isRuntimeEnvMatch(configEnv, { isForClientSide, isClientRouting, isDev }),
        '    ',
        true
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
  importStatements: string[],
  filesEnv: FilesEnv
) {
  const lines: string[] = []

  lines.push(`  configValuesSerialized: {`)
  lines.push(
    ...serializeConfigValues(
      pageConfigGlobal,
      importStatements,
      filesEnv,
      (configEnv) => isRuntimeEnvMatch(configEnv, { isForClientSide, isClientRouting, isDev }),
      '    ',
      null
    )
  )
  lines.push(`  },`)

  const code = lines.join('\n')
  return code
}
