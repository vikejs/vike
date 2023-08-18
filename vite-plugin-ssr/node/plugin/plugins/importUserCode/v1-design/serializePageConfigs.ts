// Counterpart: ../../../../../shared/getPageFiles/parsePageConfigs.ts

export { serializePageConfigs }

import { assert, assertUsage, objectEntries } from '../../../utils.js'
import type {
  ConfigElement,
  PageConfigData,
  PageConfigGlobalData
} from '../../../../../shared/page-configs/PageConfig.js'
import { generateEagerImport } from '../generateEagerImport.js'
import { getVirtualFileIdImportPageCode } from '../../../../shared/virtual-files/virtualFileImportPageCode.js'
import { debug } from './debug.js'
import { stringify } from '@brillout/json-serializer/stringify'

function serializePageConfigs(
  pageConfigsData: PageConfigData[],
  pageConfigGlobal: PageConfigGlobalData,
  isForClientSide: boolean,
  isDev: boolean,
  id: string
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
    lines.push(`    configElements: {`)
    Object.entries(configElements).forEach(([configName, configElement]) => {
      if (configElement.configEnv === 'config-only') return
      const whitespace = '      '
      lines.push(serializeConfigElement(configElement, configName, importStatements, whitespace, false))
    })
    lines.push(`    }`)
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
    let configValueSerialized: string
    try {
      configValueSerialized = stringify(configValue)
    } catch {
      assertUsage(
        false,
        `The value of the config '${configName}' cannot live inside ${configDefinedByFile}, see https://vite-plugin-ssr.com/header-file`
      )
    }
    lines.push(`${whitespace}  configValueSerialized: ${JSON.stringify(configValueSerialized)}`)
  } else {
    assert(codeFilePath)
    if (configEnv === '_routing-eager' || eagerImport) {
      const { importVar, importStatement } = generateEagerImport(codeFilePath)
      // TODO: expose all exports so that assertDefaultExport can be applied
      lines.push(`${whitespace}  configValue: ${importVar}[${JSON.stringify(codeFileExport)}]`)
      importStatements.push(importStatement)
    }
  }
  lines.push(`${whitespace}},`)
  return lines.join('\n')
}
