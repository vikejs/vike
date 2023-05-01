export { getVirtualFileImportPlusConfigs }

import { assert, isNpmPackageImportPath, objectEntries } from '../../../utils'
import type { ConfigElement, PlusConfigData, PlusConfigGlobalData } from '../../../../../shared/page-configs/PlusConfig'
import { generateEagerImport } from '../generateEagerImport'
import { getVirtualFileIdImportPageCode } from '../../../../shared/virtual-files/virtualFileImportPageCode'
import { getConfigData } from './getConfigData'
import { getInvalidator } from './invalidation'
import { debug } from './debug'
import type { ConfigVpsResolved } from '../../../../../shared/ConfigVps'

async function getVirtualFileImportPlusConfigs(
  userRootDir: string,
  isForClientSide: boolean,
  isDev: boolean,
  id: string,
  configVps: ConfigVpsResolved
): Promise<string> {
  const { plusConfigsData, plusConfigGlobal } = await getConfigData(userRootDir, isDev, true, configVps.extensions)
  return generateSourceCodeOfPlusConfigs(plusConfigsData, plusConfigGlobal, isForClientSide, isDev, id)
}

function generateSourceCodeOfPlusConfigs(
  plusConfigsData: PlusConfigData[],
  plusConfigGlobal: PlusConfigGlobalData,
  isForClientSide: boolean,
  isDev: boolean,
  id: string
): string {
  const lines: string[] = []
  const importStatements: string[] = []

  lines.push('export const plusConfigs = [];')
  // const configNamesAll = new Set<string>()
  plusConfigsData.forEach((plusConfig, i) => {
    const { plusConfigFilePathAll, pageId, routeFilesystem, routeFilesystemDefinedBy, configElements, isErrorPage } =
      plusConfig
    const virtualFileIdImportPageCode = getVirtualFileIdImportPageCode(pageId, isForClientSide)
    const plusConfigVar = `plusConfig${i + 1}` // TODO: remove outdated & unncessary variable creation
    lines.push(`{`)
    lines.push(`  const ${plusConfigVar} = {`)
    lines.push(`    pageId: ${JSON.stringify(pageId)},`)
    lines.push(`    isErrorPage: ${JSON.stringify(isErrorPage)},`)
    lines.push(`    plusConfigFilePathAll: ${JSON.stringify(plusConfigFilePathAll)},`)
    lines.push(`    routeFilesystem: ${JSON.stringify(routeFilesystem)},`)
    lines.push(`    routeFilesystemDefinedBy: ${JSON.stringify(routeFilesystemDefinedBy)},`)
    lines.push(
      `    loadPlusValueFiles: async () => (await import(${JSON.stringify(virtualFileIdImportPageCode)})).default,`
    )
    lines.push(`    configElements: {`)
    Object.entries(configElements).forEach(([configName, configElement]) => {
      // configNamesAll.add(configName)
      const whitespace = '      '
      lines.push(serializeConfigElement(configElement, configName, importStatements, whitespace, false))
    })
    lines.push(`    }`)
    lines.push('  };')
    lines.push(`  plusConfigs.push(${plusConfigVar})`)
    lines.push(`}`)
  })

  // Inject import statement to ensure that Vite adds config files to its module graph (which is needed in order for Vite to properly invalidate if a module imported by a config file is modified)
  if (isDev && !isForClientSide) {
    const configFiles: Set<string> = new Set()
    plusConfigsData.forEach((plusConfig) => {
      const { configElements, plusConfigFilePathAll } = plusConfig
      Object.entries(configElements).forEach(([_configName, configElement]) => {
        const { configEnv, plusValueFilePath } = configElement
        if (configEnv === 'config-only' && plusValueFilePath) {
          configFiles.add(plusValueFilePath)
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

  lines.push('export const plusConfigGlobal = {')
  objectEntries(plusConfigGlobal).forEach(([configName, configElement]) => {
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
  const {
    configDefinedAt,
    configDefinedByFile,
    configEnv,
    plusValueFilePath,
    plusConfigFilePath,
    plusValueFileExport
  } = configElement
  lines.push(`${whitespace}  configDefinedAt: ${JSON.stringify(configDefinedAt)},`)
  lines.push(`${whitespace}  configDefinedByFile: ${JSON.stringify(configDefinedByFile)},`)
  lines.push(`${whitespace}  plusValueFilePath: ${JSON.stringify(plusValueFilePath)},`)
  lines.push(`${whitespace}  plusValueFileExport: ${JSON.stringify(plusValueFileExport)},`)
  lines.push(`${whitespace}  plusConfigFilePath: ${JSON.stringify(plusConfigFilePath)},`)
  lines.push(`${whitespace}  configEnv: '${configEnv}',`)
  if ('configValue' in configElement) {
    assert(!eagerImport)
    const { configValue } = configElement
    lines.push(`${whitespace}  configValue: ${JSON.stringify(configValue)}`)
  } else {
    assert(plusValueFilePath)
    if (configEnv === '_routing-env' || eagerImport) {
      const { importVar, importStatement } = generateEagerImport(plusValueFilePath)
      // TODO: expose all exports so that assertDefaultExport can be applied
      lines.push(`${whitespace}  configValue: ${importVar}[${JSON.stringify(plusValueFileExport)}]`)
      importStatements.push(importStatement)
    }
  }
  lines.push(`${whitespace}},`)
  return lines.join('\n')
}
