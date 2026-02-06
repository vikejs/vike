export { generateVirtualFileGlobalEntry }

import type { PageConfigBuildTime, PageConfigGlobalBuildTime } from '../../../../types/PageConfig.js'
import { generateVirtualFileId } from '../../../../shared-server-node/virtualFileId.js'
import { debug } from './debug.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import {
  FilesEnv,
  serializeConfigValues,
} from '../../../../shared-server-client/page-configs/serialize/serializeConfigValues.js'
import { VIRTUAL_FILE_ID_constantsGlobalThis } from '../pluginReplaceConstantsGlobalThis.js'
import '../../assertEnvVite.js'

async function generateVirtualFileGlobalEntry(
  isForClientSide: boolean,
  isDev: boolean,
  id: string,
  isClientRouting: boolean,
): Promise<string> {
  const vikeConfig = await getVikeConfigInternal(true)
  const { _pageConfigs: pageConfigs, _pageConfigGlobal: pageConfigGlobal } = vikeConfig
  return getCode(pageConfigs, pageConfigGlobal, isForClientSide, isDev, id, isClientRouting)
}

function getCode(
  pageConfigs: PageConfigBuildTime[],
  pageConfigGlobal: PageConfigGlobalBuildTime,
  isForClientSide: boolean,
  isDev: boolean,
  id: string,
  isClientRouting: boolean,
): string {
  const lines: string[] = []
  const importStatements: string[] = []
  const filesEnv: FilesEnv = new Map()

  if (!isForClientSide) {
    importStatements.push(`import '${VIRTUAL_FILE_ID_constantsGlobalThis}';`)
  }

  lines.push('export const pageConfigsSerialized = [')
  lines.push(
    getCodePageConfigsSerialized(pageConfigs, isForClientSide, isClientRouting, isDev, importStatements, filesEnv),
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
      filesEnv,
    ),
  )
  lines.push('};')

  if (!isForClientSide && isDev) {
    // https://vite.dev/guide/api-environment-frameworks.html
    lines.push('if (import.meta.hot) import.meta.hot.accept();')
  }

  let code = [...importStatements, ...lines].join('\n')

  if (!isForClientSide) {
    code = `import '${VIRTUAL_FILE_ID_constantsGlobalThis}';\n` + code
  }

  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function getCodePageConfigsSerialized(
  pageConfigs: PageConfigBuildTime[],
  isForClientSide: boolean,
  isClientRouting: boolean,
  isDev: boolean,
  importStatements: string[],
  filesEnv: FilesEnv,
): string {
  const lines: string[] = []

  pageConfigs.forEach((pageConfig) => {
    const { pageId, routeFilesystem, isErrorPage } = pageConfig
    lines.push(`  {`)
    lines.push(`    pageId: ${JSON.stringify(pageId)},`)
    lines.push(`    isErrorPage: ${JSON.stringify(isErrorPage)},`)
    lines.push(`    routeFilesystem: ${JSON.stringify(routeFilesystem)},`)
    const virtualFileId = JSON.stringify(generateVirtualFileId({ type: 'page-entry', pageId, isForClientSide }))
    lines.push(
      `    loadVirtualFilePageEntry: () => ({ moduleId: ${virtualFileId}, moduleExportsPromise: import(${virtualFileId}) }),`,
    )
    lines.push(`    configValuesSerialized: {`)
    lines.push(
      ...serializeConfigValues(
        pageConfig,
        importStatements,
        filesEnv,
        { isForClientSide, isClientRouting, isDev },
        '    ',
        true,
      ),
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
  filesEnv: FilesEnv,
) {
  const lines: string[] = []

  lines.push(`  configValuesSerialized: {`)
  lines.push(
    ...serializeConfigValues(
      pageConfigGlobal,
      importStatements,
      filesEnv,
      { isForClientSide, isClientRouting, isDev },
      '    ',
      null,
    ),
  )
  lines.push(`  },`)

  const code = lines.join('\n')
  return code
}
