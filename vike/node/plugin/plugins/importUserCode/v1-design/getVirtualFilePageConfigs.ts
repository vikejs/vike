export { getVirtualFilePageConfigs }

import { assert, objectEntries } from '../../../utils.js'
import type { PageConfigBuildTime, PageConfigGlobalBuildTime } from '../../../../../shared/page-configs/PageConfig.js'
import { getVirtualFileIdPageConfigValuesAll } from '../../../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
import { debug } from './debug.js'
import { getVikeConfig } from './getVikeConfig.js'
import { isRuntimeEnvMatch } from './isRuntimeEnvMatch.js'
import { serializeConfigValueImported } from '../../../../../shared/page-configs/serialize/serializeConfigValue.js'
import type { ResolvedConfig } from 'vite'
import { getConfigValuesSerialized } from './getConfigValuesSerialized.js'

async function getVirtualFilePageConfigs(
  isForClientSide: boolean,
  isDev: boolean,
  id: string,
  isClientRouting: boolean,
  config: ResolvedConfig
): Promise<string> {
  const { pageConfigs, pageConfigGlobal } = await getVikeConfig(config, isDev, true)
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
  const varCounterContainer = { varCounter: 0 }

  lines.push('export const pageConfigsSerialized = [')
  lines.push(
    getCodePageConfigsSerialized(pageConfigs, isForClientSide, isClientRouting, importStatements, varCounterContainer)
  )
  lines.push('];')

  lines.push('export const pageConfigGlobalSerialized = {')
  lines.push(
    getCodePageConfigGlobalSerialized(pageConfigGlobal, isForClientSide, isDev, importStatements, varCounterContainer)
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
  importStatements: string[],
  varCounterContainer: { varCounter: number }
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

    // Serialized config values
    lines.push(`    configValuesSerialized: {`)
    lines.push(
      getConfigValuesSerialized(pageConfig, (configEnv) =>
        isRuntimeEnvMatch(configEnv, { isForClientSide, isClientRouting, isEager: true })
      )
    )
    lines.push(`    },`)

    // Imported config values
    const whitespace = '    '
    lines.push(`${whitespace}configValuesImported: [`)
    Object.entries(pageConfig.configValueSources).forEach(([configName, sources]) => {
      const configValue = pageConfig.configValues[configName]
      if (configValue) return
      const configValueSource = sources[0]
      assert(configValueSource)
      if (!configValueSource.configEnv.eager) return
      lines.push(
        ...serializeConfigValueImported(
          configValueSource,
          configName,
          whitespace,
          varCounterContainer,
          importStatements
        )
      )
    })
    lines.push(`${whitespace}],`)

    lines.push(`  },`)
  })

  const code = lines.join('\n')
  return code
}

function getCodePageConfigGlobalSerialized(
  pageConfigGlobal: PageConfigGlobalBuildTime,
  isForClientSide: boolean,
  isDev: boolean,
  importStatements: string[],
  varCounterContainer: { varCounter: number }
) {
  const lines: string[] = []
  /* Nothing (yet)
  lines.push(`  configValuesSerialized: {`)
  lines.push(`  },`)
  */
  lines.push(`  configValuesImported: [`)
  objectEntries(pageConfigGlobal.configValueSources).forEach(([configName, sources]) => {
    if (configName === 'onBeforeRoute') {
      // if( isForClientSide && !isClientRouting ) return
    } else if (configName === 'onPrerenderStart') {
      if (isDev || isForClientSide) {
        // Only load onPrerenderStart() in server production runtime
        return
      }
    } else {
      assert(false)
    }
    const configValueSource = sources[0]
    assert(configValueSource)
    const whitespace = '    '
    lines.push(
      ...serializeConfigValueImported(configValueSource, configName, whitespace, varCounterContainer, importStatements)
    )
  })
  lines.push(`  ],`)

  const code = lines.join('\n')
  return code
}
