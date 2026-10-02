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
import type { RuntimeEnvRuntime } from './getConfigValueSourcesRelevant.js'
import { getEnvironmentEntryPlaceholder } from '../build/pluginEnvironmentEntries.js'
import '../../assertEnvVite.js'

async function generateVirtualFileGlobalEntry(
  runtimeEnv: RuntimeEnvRuntime & { isDev: boolean },
  id: string,
): Promise<string> {
  const vikeConfig = await getVikeConfigInternal(true)
  const {
    _pageConfigs: pageConfigs,
    _pageConfigGlobal: pageConfigGlobal,
    _additionalEnvironmentNames: additionalEnvironmentNames,
  } = vikeConfig
  return getCode(pageConfigs, pageConfigGlobal, runtimeEnv, id, additionalEnvironmentNames)
}

function getCode(
  pageConfigs: PageConfigBuildTime[],
  pageConfigGlobal: PageConfigGlobalBuildTime,
  runtimeEnv: RuntimeEnvRuntime & { isDev: boolean },
  id: string,
  additionalEnvironmentNames: string[],
): string {
  const lines: string[] = []
  const importStatements: string[] = []
  const filesEnv: FilesEnv = new Map()

  const { environmentName, isDev } = runtimeEnv
  const isForClientSide = environmentName === 'client'

  if (!isForClientSide) {
    importStatements.push(`import '${VIRTUAL_FILE_ID_constantsGlobalThis}';`)
  }

  lines.push('export const pageConfigsSerialized = [')
  lines.push(getCodePageConfigsSerialized(pageConfigs, runtimeEnv, importStatements, filesEnv))
  lines.push('];')

  lines.push('export const pageConfigGlobalSerialized = {')
  lines.push(getCodePageConfigGlobalSerialized(pageConfigGlobal, runtimeEnv, importStatements, filesEnv))
  lines.push('};')

  if (environmentName === 'server') {
    lines.push(getCodeEnvironmentEntries(additionalEnvironmentNames, isDev, importStatements))
  }

  if (!isForClientSide && isDev) {
    // https://vite.dev/guide/api-environment-frameworks.html
    lines.push('if (import.meta.hot) import.meta.hot.accept();')
  }

  let code = [...importStatements, ...lines].join('\n')

  if (!isForClientSide) {
    code = `import '${VIRTUAL_FILE_ID_constantsGlobalThis}';\n` + code
  }

  debug(id, `${environmentName.toUpperCase()}-SIDE`, code)
  return code
}

// The global entries of the additional environments (e.g. `rsc`), loaded by addPageContextEnvironments.ts
// - In development, they're loaded with the environment's module runner instead
function getCodeEnvironmentEntries(additionalEnvironmentNames: string[], isDev: boolean, importStatements: string[]) {
  const entries = additionalEnvironmentNames.map((name, i) => {
    if (isDev) return `${JSON.stringify(name)}: null`
    importStatements.push(
      `import * as environmentEntry${i} from ${JSON.stringify(getEnvironmentEntryPlaceholder(name))};`,
    )
    return `${JSON.stringify(name)}: environmentEntry${i}`
  })
  return `export const environmentEntries = { ${entries.join(', ')} };`
}

function getCodePageConfigsSerialized(
  pageConfigs: PageConfigBuildTime[],
  runtimeEnv: RuntimeEnvRuntime,
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
    const virtualFileId = JSON.stringify(
      generateVirtualFileId({ type: 'page-entry', pageId, environmentName: runtimeEnv.environmentName }),
    )
    lines.push(
      `    loadVirtualFilePageEntry: () => ({ moduleId: ${virtualFileId}, moduleExportsPromise: import(${virtualFileId}) }),`,
    )
    lines.push(`    configValuesSerialized: {`)
    lines.push(...serializeConfigValues(pageConfig, importStatements, filesEnv, runtimeEnv, '    ', true))
    lines.push(`    },`)
    lines.push(`  },`)
  })

  const code = lines.join('\n')
  return code
}

function getCodePageConfigGlobalSerialized(
  pageConfigGlobal: PageConfigGlobalBuildTime,
  runtimeEnv: RuntimeEnvRuntime,
  importStatements: string[],
  filesEnv: FilesEnv,
) {
  const lines: string[] = []

  lines.push(`  configValuesSerialized: {`)
  lines.push(...serializeConfigValues(pageConfigGlobal, importStatements, filesEnv, runtimeEnv, '    ', null))
  lines.push(`  },`)

  const code = lines.join('\n')
  return code
}
