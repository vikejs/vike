export { getVirtualCodePageConfigs }

import { assert, objectEntries } from '../../../utils'
import type { ConfigSource, PageConfigData, PageConfigGlobalData } from '../../../../../shared/page-configs/PageConfig'
import { generateEagerImport } from '../helpers/generateEagerImport'
import { getVirtualFileIdImportPageCode } from '../../../../commons/virtual-files/virtualFileImportPageCode'
import { getConfigData } from './getConfigData'
import { getInvalidatorGlob } from './invalidation'
import { debug } from './debug'

// TODO: optimizeDeps
// TODO: inspect bug when hitting `r` hotkey of Vite dev server
// TODO: export type { Config } for users
// TODO: use Math.random() instead of timestamp in built file + think why I had concurrent issues
// TODO: check overall error handling

// TODO: ensure that client-side of Server Routing loads less than Client Routing

// TODO: check error handling when no onRenderHtml defined
// TODO: improve Vite dev error handling upon user setting unknown config

// TODO: if conf isn't file path then assert that it's serialazable
// TODO: Improve Vite error logging when:
//       ```
//        /pages/+config.ts sets the config onRenderHtml to the value './+config/onRenderHtml.js' but a file wasn't found at /home/rom/code/vite-plugin-ssr/examples/vanilla-v1/pages/+config/onRenderHtml.js
//       ```
// TODO: assertUsage isErrorPage not allowed to be abstract
// TODO: assertUsage() when configDefinitions sets a invalid c_env value
// TODO: rename configSrc/configSource to configDefinedBy
// TODO: Define pageContext.pageId

async function getVirtualCodePageConfigs(
  userRootDir: string,
  isForClientSide: boolean,
  isDev: boolean,
  id: string
): Promise<string> {
  const { pageConfigsData, pageConfigGlobal } = await getConfigData(userRootDir, isDev, true)
  return generateSourceCodeOfPageConfigs(pageConfigsData, pageConfigGlobal, isForClientSide, isDev, id)
}

function generateSourceCodeOfPageConfigs(
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
    const { pageConfigFilePathAll, pageId2, routeFilesystem, routeFilesystemDefinedBy, configSources, isErrorPage } =
      pageConfig
    const virtualFileIdImportPageCode = getVirtualFileIdImportPageCode(pageId2, isForClientSide)
    const pageConfigVar = `pageConfig${i + 1}` // TODO: remove outdated & unncessary variable creation
    lines.push(`{`)
    lines.push(`  const ${pageConfigVar} = {`)
    lines.push(`    pageId2: ${JSON.stringify(pageId2)},`)
    lines.push(`    isErrorPage: ${JSON.stringify(isErrorPage)},`)
    lines.push(`    pageConfigFilePathAll: ${JSON.stringify(pageConfigFilePathAll)},`)
    lines.push(`    routeFilesystem: ${JSON.stringify(routeFilesystem)},`)
    lines.push(`    routeFilesystemDefinedBy: ${JSON.stringify(routeFilesystemDefinedBy)},`)
    lines.push(`    loadCodeFiles: async () => (await import(${JSON.stringify(virtualFileIdImportPageCode)})).default,`)
    lines.push(`    configSources: {`)
    Object.entries(configSources).forEach(([configName, configSource]) => {
      // configNamesAll.add(configName)
      const whitespace = '      '
      lines.push(serializeConfigSource(configSource, configName, importStatements, whitespace, false))
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
      const { configSources, pageConfigFilePathAll } = pageConfig
      Object.entries(configSources).forEach(([_configName, configSource]) => {
        const { c_env, codeFilePath2 } = configSource
        if (c_env === 'c_config' && codeFilePath2) {
          configFiles.add(codeFilePath2)
        }
      })
      pageConfigFilePathAll.forEach((pageConfigFilePath) => {
        configFiles.add(pageConfigFilePath)
      })
    })
    Array.from(configFiles).forEach((configFile) => {
      assert(configFile.startsWith('/'))
      const { importStatement } = generateEagerImport(configFile)
      importStatements.push(importStatement)
    })
  }

  lines.push('export const pageConfigGlobal = {')
  objectEntries(pageConfigGlobal).forEach(([configName, configSource]) => {
    if (configName === 'onBeforeRoute') {
      // if( isForClientSide && !isClientRouting ) return
    } else if (configName === 'onPrerenderStart') {
      if (isDev || isForClientSide) return
    } else {
      assert(false)
    }
    const whitespace = '  '
    lines.push(serializeConfigSource(configSource, configName, importStatements, whitespace, true))
  })
  lines.push('};')

  if (isDev) {
    lines.push(getInvalidatorGlob(isDev))
  } else {
    lines.push('export const plusFilesGlob = null;')
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

function serializeConfigSource(
  configSource: ConfigSource | null,
  configName: string,
  importStatements: string[],
  whitespace: string,
  eagerImport: boolean
) {
  if (configSource === null) return `${whitespace}['${configName}']: null,`
  assert(/^\s+$/.test(whitespace))
  const lines: string[] = []
  lines.push(`${whitespace}['${configName}']: {`)
  const { configSrc, configDefinedByFile, c_env, codeFilePath2, configFilePath2 } = configSource
  lines.push(`${whitespace}  configSrc: ${JSON.stringify(configSrc)},`)
  lines.push(`${whitespace}  configDefinedByFile: ${JSON.stringify(configDefinedByFile)},`)
  lines.push(`${whitespace}  codeFilePath2: ${JSON.stringify(codeFilePath2)},`)
  lines.push(`${whitespace}  configFilePath2: ${JSON.stringify(configFilePath2)},`)
  lines.push(`${whitespace}  c_env: '${c_env}',`)
  if ('configValue' in configSource) {
    assert(!eagerImport)
    const { configValue } = configSource
    lines.push(`${whitespace}  configValue: ${JSON.stringify(configValue)}`)
  } else {
    assert(configSource.codeFilePath2)
    const { codeFilePath2, c_env } = configSource
    if (c_env === 'c_routing' || eagerImport) {
      const { importVar, importStatement } = generateEagerImport(codeFilePath2)
      // TODO: expose all exports so that assertDefaultExport() can be applied
      lines.push(`${whitespace}  configValue: ${importVar}.default`)
      importStatements.push(importStatement)
    }
  }
  lines.push(`${whitespace}},`)
  return lines.join('\n')
}
