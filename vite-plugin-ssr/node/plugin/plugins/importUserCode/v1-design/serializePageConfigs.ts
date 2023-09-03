// Counterpart: ../../../../../shared/getPageFiles/parsePageConfigs.ts

export { serializePageConfigs }

import { assert, assertUsage, getPropAccessNotation, hasProp, objectEntries } from '../../../utils.js'
import type {
  ConfigValue,
  ConfigValueSource,
  PageConfigData,
  PageConfigGlobalData
} from '../../../../../shared/page-configs/PageConfig.js'
import { generateEagerImport } from '../generateEagerImport.js'
import { getVirtualFileIdImportPageCode } from '../../../../shared/virtual-files/virtualFileImportPageCode.js'
import { debug } from './debug.js'
import { stringify } from '@brillout/json-serializer/stringify'
import { skipConfigValue } from './getVirtualFileImportCodeFiles.js'
import { getConfigEnv } from './helpers.js'
import pc from '@brillout/picocolors'

function serializePageConfigs(
  pageConfigsData: PageConfigData[],
  pageConfigGlobal: PageConfigGlobalData,
  isForClientSide: boolean,
  isDev: boolean,
  id: string,
  isClientRouting: boolean
): string {
  const lines: string[] = []
  const importStatements: string[] = []

  lines.push('export const pageConfigs = [')
  pageConfigsData.forEach((pageConfig) => {
    const { pageId, routeFilesystem, routeFilesystemDefinedBy, isErrorPage } = pageConfig
    const virtualFileIdImportPageCode = getVirtualFileIdImportPageCode(pageId, isForClientSide)
    lines.push(`  {`)
    lines.push(`    pageId: ${JSON.stringify(pageId)},`)
    lines.push(`    isErrorPage: ${JSON.stringify(isErrorPage)},`)
    lines.push(`    routeFilesystem: ${JSON.stringify(routeFilesystem)},`)
    lines.push(`    routeFilesystemDefinedBy: ${JSON.stringify(routeFilesystemDefinedBy)},`)
    lines.push(`    loadCodeFiles: async () => (await import(${JSON.stringify(virtualFileIdImportPageCode)})).default,`)

    lines.push(`    configValueSources: {`)
    Object.entries(pageConfig.configValueSources).forEach(([configName, sources]) => {
      let whitespace = '      '
      lines.push(`${whitespace}[${JSON.stringify(configName)}]: [`)
      whitespace += '  '
      sources.forEach((configValueSource) => {
        const content = serializeConfigValueSource(configValueSource, configName, whitespace, importStatements)
        assert(content.startsWith('{') && content.endsWith('},') && content.includes('\n'))
        lines.push(whitespace + content)
      })
      whitespace = whitespace.slice(2)
      lines.push(`${whitespace}],`)
    })
    lines.push(`    },`)

    lines.push(`    configValues: {`)
    Object.entries(pageConfig.configValues).forEach(([configName, configValue]) => {
      {
        const configEnv = getConfigEnv(pageConfig, configName)
        assert(configEnv, configName)
        if (skipConfigValue(configEnv, isForClientSide, isClientRouting)) return
      }
      // TODO: use @brillout/json-serializer
      //  - re-use getConfigValueSerialized()?
      const valueSerialized = JSON.stringify(configValue.value)
      serializeConfigValue(lines, configName, configValue, valueSerialized)
    })
    // TODO: resolve conflicts
    Object.entries(pageConfig.configValueSources).forEach(([configName, sources]) => {
      const configValueSource = sources[0]!
      if (configValueSource.configEnv === '_routing-eager') {
        const { definedAt } = configValueSource
        const configValue = { configName, definedAt }
        const { filePath, fileExportPath } = configValueSource.definedAt
        const [exportName] = fileExportPath
        assert(exportName)
        const configValueEagerImport = getConfigValueEagerImport(filePath, exportName, importStatements)
        serializeConfigValue(lines, configName, configValue, configValueEagerImport)
      }
    })
    lines.push(`    },`)
    lines.push(`  },`)
  })
  lines.push('];')

  lines.push('export const pageConfigGlobal = {')
  objectEntries(pageConfigGlobal).forEach(([configName, configValueSource]) => {
    if (configName === 'onBeforeRoute') {
      // if( isForClientSide && !isClientRouting ) return
    } else if (configName === 'onPrerenderStart') {
      if (isDev || isForClientSide) return
    } else {
      assert(false)
    }
    let whitespace = '  '
    let content: string
    if (configValueSource === null) {
      content = 'null,'
    } else {
      content = serializeConfigValueSource(configValueSource, configName, whitespace, importStatements, true)
      assert(content.startsWith('{') && content.endsWith('},') && content.includes('\n'))
    }
    content = `${whitespace}[${JSON.stringify(configName)}]: ${content}`
    lines.push(content)
  })
  lines.push('};')

  const code = [...importStatements, ...lines].join('\n')
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function serializeConfigValue(
  lines: string[],
  configName: string,
  configValue: Omit<ConfigValue, 'value'>,
  valueSerialized: string
) {
  let whitespace = '      '
  lines.push(`${whitespace}['${configName}']: {`)
  whitespace += '  '

  lines.push(`${whitespace}  value: ${valueSerialized},`)
  Object.entries(configValue).forEach(([key, val]) => {
    if (key === 'value') return
    // if (val === undefined) return
    lines.push(`${whitespace}  ${key}: ${JSON.stringify(val)},`)
  })

  whitespace = whitespace.slice(2)
  lines.push(`${whitespace}},`)
}

function serializeConfigValueSource(
  configValueSource: ConfigValueSource,
  configName: string,
  whitespace: string,
  importStatements: string[],
  isGlobalConfig?: true
): string {
  const { definedAt, configEnv } = configValueSource
  const lines: string[] = []
  lines.push(`{`)
  lines.push(`${whitespace}  definedAt: ${JSON.stringify(definedAt)},`)
  lines.push(`${whitespace}  configEnv: ${JSON.stringify(configEnv)},`)
  if (configEnv !== 'config-only') {
    if ('value' in configValueSource) {
      const { value } = configValueSource
      const valueSerialized = getConfigValueSerialized(value, configName, definedAt.filePath)
      lines.push(`${whitespace}  valueSerialized: ${valueSerialized}`)
    } else if (configValueSource.configEnv === '_routing-eager' || isGlobalConfig) {
      const { filePath, fileExportPath } = configValueSource.definedAt
      const [exportName] = fileExportPath
      assert(exportName)
      const configValueEagerImport = getConfigValueEagerImport(filePath, exportName, importStatements)
      lines.push(`${whitespace}  value: ${configValueEagerImport},`)
    }
  }
  lines.push(`${whitespace}},`)
  return lines.join('\n')
}
function getConfigValueSerialized(value: unknown, configName: string, configDefinedByFile: string): string {
  let configValueSerialized: string
  const valueName = `config${getPropAccessNotation(configName)}`
  try {
    configValueSerialized = stringify(value, { valueName })
  } catch (err) {
    assert(hasProp(err, 'messageCore', 'string'))
    const configPath = pc.bold(configDefinedByFile)
    assertUsage(
      false,
      [
        `The value of the config ${pc.cyan(configName)} cannot be defined inside the file ${configPath}.`,
        `Its value must be defined in an another file and then imported by ${configPath} (because it isn't serializable: ${err.messageCore}).`,
        `Only serializable config values can be defined inside ${configPath}, see https://vite-plugin-ssr.com/header-file.`
      ].join(' ')
    )
  }
  configValueSerialized = JSON.stringify(configValueSerialized)
  return configValueSerialized
}
function getConfigValueEagerImport(codeFilePath: string, codeFileExport: string, importStatements: string[]) {
  let configValueEagerImport: string
  const { importVar, importStatement } = generateEagerImport(codeFilePath)
  importStatements.push(importStatement)
  // TODO: expose all exports so that assertDefaultExport can be applied
  configValueEagerImport = `${importVar}[${JSON.stringify(codeFileExport)}]`
  return configValueEagerImport
}
