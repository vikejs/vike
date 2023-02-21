export { generatePageConfigsSourceCode }
export { generatePageConfigVirtualFile }

import { assert, createDebugger } from '../../../utils'

import type { PageConfigData } from '../../../../../shared/page-configs/PageConfig'
import { generateEagerImport } from '../generateEagerImport'
import {
  getVirutalModuleIdPageCodeFilesImporter,
  isVirutalModulePageCodeFilesImporter
} from '../../../../commons/virtualIdPageCodeFilesImporter'
import { loadPageConfigsData, type PageConfigGlobal } from './getPageConfigsData'

let pageConfigsData: null | PageConfigData[] = null

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

async function generatePageConfigsSourceCode(
  userRootDir: string,
  isForClientSide: boolean,
  isDev: boolean,
  id: string
): Promise<string> {
  const result = await loadPageConfigsData(userRootDir, isDev)
  pageConfigsData = result.pageConfigsData
  const { pageConfigGlobal } = result
  return generateSourceCodeOfPageConfigs(pageConfigsData, pageConfigGlobal, isForClientSide, isDev, id)
}

function generateSourceCodeOfPageConfigs(
  pageConfigsData: PageConfigData[],
  pageConfigGlobal: PageConfigGlobal,
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
    const codeFilesImporter = getVirutalModuleIdPageCodeFilesImporter(pageId2, isForClientSide)
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
      lines.push(`      ['${configName}']: {`)
      const { configSrc, configDefinedByFile, c_env, codeFilePath2, configFilePath2 } = configSource
      lines.push(`        configSrc: ${JSON.stringify(configSrc)},`)
      lines.push(`        configDefinedByFile: ${JSON.stringify(configDefinedByFile)},`)
      lines.push(`        codeFilePath2: ${JSON.stringify(codeFilePath2)},`)
      lines.push(`        configFilePath2: ${JSON.stringify(configFilePath2)},`)
      lines.push(`        c_env: '${c_env}',`)
      if ('configValue' in configSource) {
        const { configValue } = configSource
        lines.push(`        configValue: ${JSON.stringify(configValue)}`)
      } else {
        assert(configSource.codeFilePath2)
        const { codeFilePath2, c_env } = configSource
        if (c_env === 'c_routing') {
          const { importVar, importStatement } = generateEagerImport(codeFilePath2)
          // TODO: expose all exports so that assertDefaultExport() can be applied
          lines.push(`        configValue: ${importVar}.default`)
          importStatements.push(importStatement)
        }
      }
      lines.push(`      },`)
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
  Object.entries(pageConfigGlobal).forEach(([configName, configValue]) => {
    lines.push(`  ['${configName}']: ${configValue},`)
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

async function generatePageConfigVirtualFile(
  id: string,
  isForClientSide: boolean,
  userRootDir: string,
  isDev: boolean
): Promise<null | string> {
  const result = isVirutalModulePageCodeFilesImporter(id)
  if (!result) return null
  assert(result.isForClientSide === isForClientSide)
  const { pageId } = result
  if (!pageConfigsData) {
    const result = await loadPageConfigsData(userRootDir, isDev)
    pageConfigsData = result.pageConfigsData
  }
  assert(pageConfigsData)
  const pageConfigData = pageConfigsData.find((pageConfigData) => pageConfigData.pageId2 === pageId)
  assert(pageConfigData)
  const code = generateSourceCodeOfLoadCodeFileVirtualFile(pageConfigData, isForClientSide, isDev)
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function generateSourceCodeOfLoadCodeFileVirtualFile(
  pageConfigData: PageConfigData,
  isForClientSide: boolean,
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
  if (isDev) {
    lines.push(getInvalidatorGlob(isDev))
  }
  const code = [...importStatements, ...lines].join('\n')
  return code
}

// TODO: collocate entire invalidation strategy
function getInvalidatorGlob(isDev: boolean) {
  assert(isDev)
  // The crawled files are never loaded (the plusFilesGlob export isn't used), the only effect of this glob is to invalidate the virtual module.
  // We agressively invalidate the virual files because they are cheap and fast to re-create.
  // The plusFilesGlob export isn't really used: it's only used to assert that we don't glob any unexpected file.
  return "export const plusFilesGlob = import.meta.glob('/**/+*');"
}
