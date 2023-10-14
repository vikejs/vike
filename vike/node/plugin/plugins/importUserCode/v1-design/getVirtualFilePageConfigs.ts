export { getVirtualFilePageConfigs }
export { getConfigValueSerialized }

import { assert, assertUsage, getPropAccessNotation, hasProp, objectEntries } from '../../../utils.js'
import type {
  ConfigValueSerialized,
  DefinedAtInfo,
  PageConfigBuildTime,
  PageConfigGlobalAtBuildTime
} from '../../../../../shared/page-configs/PageConfig.js'
import { getVirtualFileIdPageConfigValuesAll } from '../../../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
import { debug } from './debug.js'
import { stringify } from '@brillout/json-serializer/stringify'
import { getConfigEnv } from './helpers.js'
import pc from '@brillout/picocolors'
import { getVikeConfig } from './getVikeConfig.js'
import type { ConfigVikeResolved } from '../../../../../shared/ConfigVike.js'
import { isConfigEnvMatch } from './isConfigEnvMatch.js'
import { serializeConfigValueImported } from './getVirtualFilePageConfigValuesAll.js'

async function getVirtualFilePageConfigs(
  userRootDir: string,
  isForClientSide: boolean,
  isDev: boolean,
  id: string,
  configVike: ConfigVikeResolved,
  isClientRouting: boolean
): Promise<string> {
  const { pageConfigs, pageConfigGlobal } = await getVikeConfig(userRootDir, isDev, configVike.extensions, true)
  return getContent(pageConfigs, pageConfigGlobal, isForClientSide, isDev, id, isClientRouting)
}

function getContent(
  pageConfigs: PageConfigBuildTime[],
  pageConfigGlobal: PageConfigGlobalAtBuildTime,
  isForClientSide: boolean,
  isDev: boolean,
  id: string,
  isClientRouting: boolean
): string {
  const lines: string[] = []
  const importStatements: string[] = []
  const varCounterContainer = { varCounter: 0 }

  lines.push('export const pageConfigs = [')
  pageConfigs.forEach((pageConfig) => {
    const { pageId, routeFilesystem, isErrorPage } = pageConfig
    const virtualFileIdPageConfigValuesAll = getVirtualFileIdPageConfigValuesAll(pageId, isForClientSide)
    lines.push(`  {`)
    lines.push(`    pageId: ${JSON.stringify(pageId)},`)
    lines.push(`    isErrorPage: ${JSON.stringify(isErrorPage)},`)
    lines.push(`    routeFilesystem: ${JSON.stringify(routeFilesystem)},`)
    lines.push(
      `    loadConfigValuesAll: async () => (await import(${JSON.stringify(
        virtualFileIdPageConfigValuesAll
      )})).default,`
    )

    lines.push(`    configValues: {`)
    Object.entries(pageConfig.configValueSources).forEach(([configName, sources]) => {
      const configValue = pageConfig.configValues[configName]
      if (configValue) {
        const configEnv = getConfigEnv(pageConfig, configName)
        assert(configEnv, configName)
        if (!isConfigEnvMatch(configEnv, isForClientSide, isClientRouting)) return
        const { value, definedAtInfo } = configValue
        const valueSerialized = getConfigValueSerialized(value, configName, definedAtInfo)
        serializeConfigValue(lines, configName, { definedAtInfo, valueSerialized })
      }
    })
    lines.push(`    },`)

    let whitespace = '    '
    lines.push(`${whitespace}configValuesImported: [`)
    Object.entries(pageConfig.configValueSources).forEach(([configName, sources]) => {
      const configValue = pageConfig.configValues[configName]
      if (configValue) return
      const configValueSource = sources[0]
      assert(configValueSource)
      if (configValueSource.configEnv !== '_routing-eager') return
      assert(!configValueSource.isComputed)
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

    // pageConfig end
    lines.push(`  },`)
  })
  lines.push('];')

  lines.push('export const pageConfigGlobal = {')
  lines.push(`  configValues: {`)
  // Nothing (yet?)
  lines.push(`  },`)
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
  lines.push('};')

  const code = [...importStatements, ...lines].join('\n')
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function serializeConfigValue(lines: string[], configName: string, configValueSerialized: ConfigValueSerialized) {
  let whitespace = '      '
  lines.push(`${whitespace}['${configName}']: {`)
  whitespace += '  '

  Object.entries(configValueSerialized).forEach(([key, val]) => {
    const valSerialized = key === 'definedAtInfo' ? JSON.stringify(val) : val
    lines.push(`${whitespace}  ${key}: ${valSerialized},`)
  })

  whitespace = whitespace.slice(2)
  lines.push(`${whitespace}},`)
}

function getConfigValueSerialized(value: unknown, configName: string, definedAtInfo: null | DefinedAtInfo): string {
  let configValueSerialized: string
  const valueName = `config${getPropAccessNotation(configName)}`
  try {
    configValueSerialized = stringify(value, { valueName })
  } catch (err) {
    assert(hasProp(err, 'messageCore', 'string'))

    // definedAtInfo is null when config value is:
    //  - computed => all computed values defined by Vike can are serializable
    //  - cumulative => the values are already ensured to be serializable
    assert(definedAtInfo)

    const configDefinedByFile = definedAtInfo.filePath
    assert(configDefinedByFile)
    assertUsage(
      false,
      [
        `The value of the config ${pc.cyan(configName)} cannot be defined inside the file ${configDefinedByFile}:`,
        `its value must be defined in an another file and then imported by ${configDefinedByFile}. (Because the value isn't serializable: ${err.messageCore}.)`,
        `Only serializable config values can be defined inside +config.h.js files, see https://vike.dev/header-file.`
      ].join(' ')
    )
  }
  configValueSerialized = JSON.stringify(configValueSerialized)
  return configValueSerialized
}
