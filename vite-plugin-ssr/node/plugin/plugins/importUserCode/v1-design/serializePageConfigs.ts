// Counterpart: ../../../../../shared/getPageFiles/parsePageConfigs.ts

export { serializePageConfigs }

import { assert, assertUsage, objectEntries } from '../../../utils.js'
import type {
  ConfigElement,
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
import { getConfigEnv } from './getConfigEnv.js'

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
    const { pageId, routeFilesystem, routeFilesystemDefinedBy, configElements, isErrorPage } = pageConfig
    const virtualFileIdImportPageCode = getVirtualFileIdImportPageCode(pageId, isForClientSide)
    lines.push(`  {`)
    lines.push(`    pageId: ${JSON.stringify(pageId)},`)
    lines.push(`    isErrorPage: ${JSON.stringify(isErrorPage)},`)
    lines.push(`    routeFilesystem: ${JSON.stringify(routeFilesystem)},`)
    lines.push(`    routeFilesystemDefinedBy: ${JSON.stringify(routeFilesystemDefinedBy)},`)
    lines.push(`    loadCodeFiles: async () => (await import(${JSON.stringify(virtualFileIdImportPageCode)})).default,`)

    // TODO: remove
    lines.push(`    configElements: {`)
    Object.entries(configElements).forEach(([configName, configElement]) => {
      if (configElement.configEnv === 'config-only') return
      const whitespace = '      '
      lines.push(serializeConfigElement(configElement, configName, importStatements, whitespace, false))
    })
    lines.push(`    },`)

    lines.push(`    configValueSources: {`)
    Object.entries(pageConfig.configValueSources).forEach(([configName, sources]) => {
      let whitespace = '      '
      lines.push(`${whitespace}[${JSON.stringify(configName)}]: [`)
      whitespace += '  '
      sources.forEach((configValueSource) => {
        lines.push(serializeConfigValueSource(configValueSource, configName, whitespace))
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
  objectEntries(pageConfigGlobal).forEach(([configName, configElement]) => {
    if (configName === 'onBeforeRoute') {
      // if( isForClientSide && !isClientRouting ) return
    } else if (configName === 'onPrerenderStart') {
      if (isDev || isForClientSide) return
    } else {
      assert(false)
    }
    const whitespace = '  '
    lines.push(serializeConfigElement(configElement, configName, importStatements, whitespace, true))
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

function serializeConfigElement(
  configElement: ConfigElement | null,
  configName: string,
  importStatements: string[],
  whitespace: string,
  eagerImport: boolean
) {
  if (configElement === null) return `${whitespace}['${configName}']: null,`
  assert(configElement.configEnv !== 'config-only')
  const lines: string[] = []
  lines.push(`${whitespace}['${configName}']: {`)
  const { configDefinedAt, configDefinedByFile, configEnv, codeFilePath, codeFileExport, plusConfigFilePath } =
    configElement
  lines.push(`${whitespace}  configDefinedAt: ${JSON.stringify(configDefinedAt)},`)
  lines.push(`${whitespace}  configDefinedByFile: ${JSON.stringify(configDefinedByFile)},`)
  lines.push(`${whitespace}  codeFilePath: ${JSON.stringify(codeFilePath)},`)
  lines.push(`${whitespace}  codeFileExport: ${JSON.stringify(codeFileExport)},`)
  lines.push(`${whitespace}  plusConfigFilePath: ${JSON.stringify(plusConfigFilePath)},`)
  lines.push(`${whitespace}  configEnv: '${configEnv}',`)
  if ('configValue' in configElement) {
    assert(!eagerImport)
    const { configValue } = configElement
    const configValueSerialized = getConfigValueSerialized(configValue, configName, configDefinedByFile)
    lines.push(`${whitespace}  configValueSerialized: ${configValueSerialized}`)
  } else {
    assert(codeFilePath)
    if (configEnv === '_routing-eager' || eagerImport) {
      const configValueEagerImport = getConfigValueEagerImport(codeFilePath, codeFileExport, importStatements)
      lines.push(`${whitespace}  configValue: ${configValueEagerImport}`)
    }
  }
  lines.push(`${whitespace}},`)
  return lines.join('\n')
}

function serializeConfigValueSource(configValueSource: ConfigValueSource, configName: string, whitespace: string) {
  const { definedAt, configEnv } = configValueSource
  const lines: string[] = []
  lines.push(`${whitespace}{`)
  lines.push(`${whitespace}  definedAt: ${JSON.stringify(definedAt)},`)
  lines.push(`${whitespace}  configEnv: ${JSON.stringify(configEnv)},`)
  if ('configValue' in configValueSource) {
    const { configValue } = configValueSource
    const valueSerialized = getConfigValueSerialized(configValue, configName, definedAt.filePath)
    lines.push(`${whitespace}  valueSerialized: ${valueSerialized}`)
  }
  lines.push(`${whitespace}},`)
  return lines.join('\n')
}
function getConfigValueSerialized(value: unknown, configName: string, configDefinedByFile: string): string {
  let configValueSerialized: string
  try {
    configValueSerialized = stringify(value)
  } catch {
    assertUsage(
      false,
      `The value of the config '${configName}' cannot live inside ${configDefinedByFile}, see https://vite-plugin-ssr.com/header-file`
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
