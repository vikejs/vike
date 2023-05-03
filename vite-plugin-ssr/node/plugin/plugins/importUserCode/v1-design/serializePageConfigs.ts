// Counterpart: ../../../../../shared/getPageFiles/parsePageConfigs.ts

export { serializePageConfigs }

import { assert, assertUsage, isNpmPackageImportPath, objectEntries } from '../../../utils'
import type { ConfigElement, PageConfigData, PageConfigGlobalData } from '../../../../../shared/page-configs/PageConfig'
import { generateEagerImport } from '../generateEagerImport'
import { getVirtualFileIdImportPageCode } from '../../../../shared/virtual-files/virtualFileImportPageCode'
import { getInvalidator } from './invalidation'
import { debug } from './debug'
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

  lines.push('export const pageConfigs = [];')
  // const configNamesAll = new Set<string>()
  pageConfigsData.forEach((pageConfig, i) => {
    const { plusConfigFilePathAll, pageId, routeFilesystem, routeFilesystemDefinedBy, configElements, isErrorPage } =
      pageConfig
    const virtualFileIdImportPageCode = getVirtualFileIdImportPageCode(pageId, isForClientSide)
    const pageConfigVar = `pageConfig${i + 1}` // TODO: remove outdated & unncessary variable creation
    lines.push(`{`)
    lines.push(`  const ${pageConfigVar} = {`)
    lines.push(`    pageId: ${JSON.stringify(pageId)},`)
    lines.push(`    isErrorPage: ${JSON.stringify(isErrorPage)},`)
    lines.push(`    plusConfigFilePathAll: ${JSON.stringify(plusConfigFilePathAll)},`)
    lines.push(`    routeFilesystem: ${JSON.stringify(routeFilesystem)},`)
    lines.push(`    routeFilesystemDefinedBy: ${JSON.stringify(routeFilesystemDefinedBy)},`)
    lines.push(`    loadCodeFiles: async () => (await import(${JSON.stringify(virtualFileIdImportPageCode)})).default,`)
    lines.push(`    configElements: {`)
    Object.entries(configElements).forEach(([configName, configElement]) => {
      // configNamesAll.add(configName)
      const whitespace = '      '
      lines.push(serializeConfigElement(configElement, configName, importStatements, whitespace, false))
    })
    lines.push(`    }`)
    lines.push('  };')
    lines.push(`  pageConfigs.push(${pageConfigVar})`)
    lines.push(`}`)
  })

  // Inject import statement to ensure that Vite adds config files to its module graph (which is needed in order for Vite to properly invalidate if a module imported by a config file is modified)
  if (isDev && !isForClientSide) {
    const configFiles: Set<string> = new Set()
    pageConfigsData.forEach((pageConfig) => {
      const { configElements, plusConfigFilePathAll } = pageConfig
      Object.entries(configElements).forEach(([_configName, configElement]) => {
        const { configEnv, codeFilePath } = configElement
        if (configEnv === 'config-only' && codeFilePath) {
          configFiles.add(codeFilePath)
        }
      })
      plusConfigFilePathAll.forEach((plusConfigFilePath) => {
        configFiles.add(plusConfigFilePath)
      })
    })
    Array.from(configFiles).forEach((configFile) => {
      assert(configFile.startsWith('/') || isNpmPackageImportPath(configFile))
      const { importStatement } = generateEagerImport(configFile)
      importStatements.push(importStatement)
    })
  }

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

  if (isDev) {
    lines.push(getInvalidator(isDev))
  } else {
    lines.push('export const invalidator = null;')
  }
  // TODO: remove
  // lines.push('import.meta.glob([')
  // ;['config', ...configNamesAll].forEach((configName) => {
  //   lines.push(`'/**/+${configName}.${scriptFileExtensions}',`)
  // })
  // lines.push(']);')

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
  assert(/^\s+$/.test(whitespace))
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
        `The code of config '${configName}' cannot live inside ${configDefinedByFile}, see https://vite-plugin-ssr.com/config-code-splitting`
      )
    }
    lines.push(`${whitespace}  configValueSerialized: ${JSON.stringify(configValueSerialized)}`)
  } else {
    assert(codeFilePath)
    if (configEnv === '_routing-env' || eagerImport) {
      const { importVar, importStatement } = generateEagerImport(codeFilePath)
      // TODO: expose all exports so that assertDefaultExport can be applied
      lines.push(`${whitespace}  configValue: ${importVar}[${JSON.stringify(codeFileExport)}]`)
      importStatements.push(importStatement)
    }
  }
  lines.push(`${whitespace}},`)
  return lines.join('\n')
}
