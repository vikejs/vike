export { getVirtualFilePageConfigs }
export { getConfigValueSerialized }

import { assert, assertUsage, getPropAccessNotation, objectEntries } from '../../../utils.js'
import type {
  DefinedAt,
  PageConfigBuildTime,
  PageConfigGlobalBuildTime
} from '../../../../../shared/page-configs/PageConfig.js'
import { getVirtualFileIdPageConfigValuesAll } from '../../../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
import { debug } from './debug.js'
import { isJsonSerializerError, stringify } from '@brillout/json-serializer/stringify'
import { getConfigEnv } from './helpers.js'
import pc from '@brillout/picocolors'
import { getVikeConfig } from './getVikeConfig.js'
import { isRuntimeEnvMatch } from './isRuntimeEnvMatch.js'
import { getConfigValueFilePathToShowToUser } from '../../../../../shared/page-configs/helpers.js'
import {
  serializeConfigValue,
  serializeConfigValueImported
} from '../../../../../shared/page-configs/serialize/serializeConfigValue.js'
import type { ResolvedConfig } from 'vite'

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
  lines.push(
    getCodePageConfigsSerialized(pageConfigs, isForClientSide, isClientRouting, importStatements, varCounterContainer)
  )
  lines.push(
    getCodePageConfigGlobalSerialized(pageConfigGlobal, isForClientSide, isDev, importStatements, varCounterContainer)
  )
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
  lines.push('export const pageConfigsSerialized = [')
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

    lines.push(`    configValuesSerialized: {`)
    Object.entries(pageConfig.configValuesComputed).forEach(([configName, configValuesComputed]) => {
      const { value, configEnv } = configValuesComputed
      if (!isRuntimeEnvMatch(configEnv, { isForClientSide, isClientRouting, isEager: true })) return
      if (pageConfig.configValueSources[configName]) return
      const configValue = pageConfig.configValues[configName]
      assert(configValue)
      const { definedAt } = configValue
      const valueSerialized = getConfigValueSerialized(value, configName, definedAt)
      serializeConfigValue(lines, configName, { definedAt, valueSerialized })
    })
    Object.entries(pageConfig.configValueSources).forEach(([configName]) => {
      const configValue = pageConfig.configValues[configName]
      if (configValue) {
        const configEnv = getConfigEnv(pageConfig.configValueSources, configName)
        assert(configEnv, configName)
        const isEnvMatch = isRuntimeEnvMatch(configEnv, { isForClientSide, isClientRouting, isEager: true })
        if (!isEnvMatch) return
        const { value, definedAt } = configValue
        const valueSerialized = getConfigValueSerialized(value, configName, definedAt)
        serializeConfigValue(lines, configName, { definedAt, valueSerialized })
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
      if (configValueSource.configEnv !== { server: true, client: '_client-routing', _eager: true }) return
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
  lines.push('export const pageConfigGlobalSerialized = {')
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
  lines.push('};')

  const code = lines.join('\n')
  return code
}

function getConfigValueSerialized(value: unknown, configName: string, definedAt: DefinedAt): string {
  const valueName = `config${getPropAccessNotation(configName)}`
  let configValueSerialized: string
  try {
    configValueSerialized = stringify(value, { valueName, forbidReactElements: true })
  } catch (err) {
    let serializationErrMsg = ''
    if (isJsonSerializerError(err)) {
      serializationErrMsg = err.messageCore
    } else {
      // When a property getter throws an error
      console.error('Serialization error:')
      console.error(err)
      serializationErrMsg = 'see serialization error printed above'
    }
    const configValueFilePathToShowToUser = getConfigValueFilePathToShowToUser({ definedAt })
    assert(configValueFilePathToShowToUser)
    assertUsage(
      false,
      [
        `The value of the config ${pc.cyan(
          configName
        )} cannot be defined inside the file ${configValueFilePathToShowToUser}:`,
        `its value must be defined in an another file and then imported by ${configValueFilePathToShowToUser}. (Because its value isn't serializable: ${serializationErrMsg}.)`,
        `Only serializable config values can be defined inside +config.h.js files, see https://vike.dev/header-file.`
      ].join(' ')
    )
  }
  configValueSerialized = JSON.stringify(configValueSerialized)
  return configValueSerialized
}
