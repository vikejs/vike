export { generatePageConfigsSourceCode }
export { generatePageConfigVirtualFile }

import { assert, createDebugger, objectEntries } from '../../../utils'

import type { ConfigSource, PageConfigData, PageConfigGlobalData } from '../../../../../shared/page-configs/PageConfig'
import { generateEagerImport } from '../generateEagerImport'
import {
  getVirtualModuleIdImportPageCode,
  isVirtualModuleIdImportPageCode
} from '../../../../commons/virtual-files/virtualModuleImportPageCode'
import { getConfigData } from './getConfigData'
import { getInvalidatorGlob } from './invalidation'
import { extractAssetsAddQuery } from '../../extractAssetsPlugin/extractAssetsAddQuery'

// TODO remove old debug:glob
export const debug = createDebugger('vps:virtual-files')

// TODO: ensure that client-side of Server Routing loads less than Client Routing
// TODO: create one virtual file per route
// TODO: if conf isn't file path then assert that it's serialazable
// TODO: use Math.random() instead of timestamp in built file + think why I had concurrent issues
// TODO: Improve Vite error logging when:
//       ```
//        /pages/+config.ts sets the config onRenderHtml to the value './+config/onRenderHtml.js' but a file wasn't found at /home/rom/code/vite-plugin-ssr/examples/vanilla-v1/pages/+config/onRenderHtml.js
//       ```
// TODO: comment https://github.com/reactjs/reactjs.org/pull/5487#issuecomment-1409720741
// TODO: Define pageContext.pageId
// TODO: Check/improve dist/ names
// TODO: export type { Config } for users
// TODO: improve Vite dev error handling upon user setting unknown config
// TODO: assertUsage isErrorPage not allowed to be abstract
// TODO: check whether onBeforerRender() is isomorph or server-only in react-full-v1 example
// TODO: rename configSrc/configSource to configDefinedBy
// TODO: check error handling when no onRenderHtml defined
// TODO: assertUsage() when configDefinitions sets a invalid c_env value
// TODO: inspect bug when hitting `r` hotkey of Vite dev server
// TODO: inprove `dist/` filenames

async function generatePageConfigsSourceCode(
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
    const codeFilesImporter = getVirtualModuleIdImportPageCode(pageId2, isForClientSide)
    const pageConfigVar = `pageConfig${i + 1}` // TODO: remove outdated & unncessary variable creation
    lines.push(`{`)
    lines.push(`  const ${pageConfigVar} = {`)
    lines.push(`    pageId2: ${JSON.stringify(pageId2)},`)
    lines.push(`    isErrorPage: ${JSON.stringify(isErrorPage)},`)
    lines.push(`    pageConfigFilePathAll: ${JSON.stringify(pageConfigFilePathAll)},`)
    lines.push(`    routeFilesystem: ${JSON.stringify(routeFilesystem)},`)
    lines.push(`    routeFilesystemDefinedBy: ${JSON.stringify(routeFilesystemDefinedBy)},`)
    lines.push(`    loadCodeFiles: async () => (await import(${JSON.stringify(codeFilesImporter)})).default,`)
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

async function generatePageConfigVirtualFile(
  id: string,
  userRootDir: string,
  isDev: boolean,
  includeAssetsImportedByServer: boolean
): Promise<string> {
  const result = isVirtualModuleIdImportPageCode(id)
  assert(result)
  /* This assertion fails when using includeAssetsImportedByServer
  {
    const isForClientSide = !config.build.ssr
    assert(result.isForClientSide === isForClientSide)
  }
  */
  const { pageId, isForClientSide } = result
  const { pageConfigsData } = await getConfigData(userRootDir, isDev, false)
  assert(pageConfigsData)
  const pageConfigData = pageConfigsData.find((pageConfigData) => pageConfigData.pageId2 === pageId)
  assert(pageConfigData)
  const code = generateSourceCodeOfLoadCodeFileVirtualFile(
    pageConfigData,
    isForClientSide,
    pageId,
    includeAssetsImportedByServer,
    isDev
  )
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function generateSourceCodeOfLoadCodeFileVirtualFile(
  pageConfigData: PageConfigData,
  isForClientSide: boolean,
  pageId: string,
  includeAssetsImportedByServer: boolean,
  isDev: boolean
): string {
  const lines: string[] = []
  const importStatements: string[] = []
  lines.push('export default [')
  let varCounter = 0
  Object.entries(pageConfigData.configSources).forEach(([configName, configSource]) => {
    if (!configSource.codeFilePath2) return
    const { c_env, codeFilePath2 } = configSource
    if (c_env === 'c_routing' || c_env === 'c_config') return
    if (c_env === (isForClientSide ? 'server-only' : 'client-only')) return
    const { importVar, importStatement } = generateEagerImport(codeFilePath2, varCounter++)
    importStatements.push(importStatement)
    lines.push(`  {`)
    lines.push(`    configName: '${configName}',`)
    lines.push(`    codeFilePath3: '${codeFilePath2}',`)
    lines.push(`    codeFileExports: ${importVar}`)
    lines.push(`  },`)
  })
  lines.push('];')
  if (includeAssetsImportedByServer && isForClientSide && !isDev) {
    lines.push(`import '${extractAssetsAddQuery(getVirtualModuleIdImportPageCode(pageId, false))}'`)
  }
  const code = [...importStatements, ...lines].join('\n')
  return code
}
