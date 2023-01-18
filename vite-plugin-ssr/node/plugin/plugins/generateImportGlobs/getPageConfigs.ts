// export { getPageConfigsFromGlob }
// export { getPageConfigs }
//export { isValidPageConfigFile }
export { generatePageConfigsSourceCode }

// TODO: ensure that `route` isn't a file path but a route string (same for onBeforeRoute)

import {
  determinePageId2,
  determineRouteFromFilesystemPath
} from '../../../../shared/route/deduceRouteStringFromFilesystemPath'
import {
  assertPosixPath,
  assert,
  isObject,
  assertUsage,
  isPosixPath,
  toPosixPath,
  assertWarning
} from '../../utils'
import path from 'path'

import type { CodeEnv, ConfigSource } from '../../../../shared/page-configs/PageConfig'
import { loadPageConfigFiles, PageConfigFile } from '../../helpers'

/*
const filePathConfigs = ['onRenderHtml', 'onRenderClient', 'onBeforeRoute', 'Page'] as const // TODO: remove
const directConfigs = ['passToClient'] as const // TODO: remove
*/

const configDefinitions: Record<
  string,
  {
    configValueLocation: 'file' | 'inline'
    codeEnv: CodeEnv
  }
> = {
  onRenderHtml: {
    configValueLocation: 'file',
    codeEnv: 'server-only'
  },
  onRenderClient: {
    configValueLocation: 'file',
    codeEnv: 'client-only'
  },
  Page: {
    configValueLocation: 'file',
    codeEnv: 'server-and-client'
  },
  passToClient: {
    configValueLocation: 'inline',
    codeEnv: 'server-only'
  },
  route: {
    configValueLocation: 'inline',
    codeEnv: 'server-and-client'
  },
  iKnowThePerformanceRisksOfAsyncRouteFunctions: {
    configValueLocation: 'inline',
    codeEnv: 'server-and-client'
  }
}

async function generatePageConfigsSourceCode(
  userRootDir: string,
  isForClientSide: boolean,
  isDev: boolean
): Promise<string> {
  try {
    return await getCode(userRootDir, isForClientSide)
  } catch (err) {
    // Properly handle error during transpilation so that we can use assertUsage() during transpilation
    if (isDev) {
      throw err
    } else {
      // TODO update error message example
      // Avoid ugly:
      // ```
      // [vite-plugin-ssr:virtualModulePageFiles] Could not load virtual:vite-plugin-ssr:pageFiles:client:client-routing (imported by ../../vite-plugin-ssr/dist/esm/client/router/pageFiles.js): eiqwuh
      // error during build:
      // Error: Could not load virtual:vite-plugin-ssr:pageFiles:client:client-routing (imported by ../../vite-plugin-ssr/dist/esm/client/router/pageFiles.js): eiqwuh
      //     at Object.load (/home/rom/code/vite-plugin-ssr/vite-plugin-ssr/dist/cjs/node/plugin/plugins/generateImportGlobs.js:55:19)
      //     at file:///home/rom/code/vite-plugin-ssr/node_modules/.pnpm/rollup@3.7.3/node_modules/rollup/dist/es/shared/rollup.js:23399:40
      //  ELIFECYCLE  Command failed with exit code 1.
      // ```
      console.log('')
      console.error(err)
      process.exit(1)
    }
  }
}

async function getCode(userRootDir: string, isForClientSide: boolean): Promise<string> {
  const result = await loadPageConfigFiles(userRootDir)

  if ('hasError' in result) {
    return 'export const pageConfigs = null;'
  }

  const { pageConfigFiles } = result

  const lines: string[] = []

  lines.push('export const pageConfigs = [];')

  const pageConfigFilesAbstract = pageConfigFiles.filter((p) => isAbstract(p))
  const pageConfigFilesConcrete = pageConfigFiles.filter((p) => !isAbstract(p))
  pageConfigFilesConcrete
    .forEach((pageConfigFile) => {
      const { pageConfigFilePath, pageConfigFileExports } = pageConfigFile
      const pageConfigValues = getPageConfigValues(pageConfigFile)
      const pageId2 = determinePageId2(pageConfigFilePath)
      const route =
        pageConfigValues.route || // TODO: assertUsage that route isn't a path
        determineRouteFromFilesystemPath(pageConfigFilePath)

      const configSources: {
        configName: string
        configSource: ConfigSource
      }[] = []
      Object.entries(configDefinitions)
        .filter(([_configName, { codeEnv }]) => codeEnv !== (isForClientSide ? 'server-only' : 'client-only'))
        .forEach(([configName, { configValueLocation, codeEnv }]) => {
          const result = resolveConfigValue(configName, pageConfigFile, pageConfigFilesAbstract)
          if (!result) return
          const { pageConfigValue, pageConfigValueFilePath } = result
          if (configValueLocation === 'inline') {
            configSources.push({
              configName,
              configSource: {
                configFilePath: pageConfigValueFilePath,
                configValue: pageConfigValue
              }
            })
          }
          if (configValueLocation === 'file') {
            assertUsage(typeof pageConfigValue === 'string', 'TODO')
            const codeFilePath = resolveCodeFilePath(pageConfigValue, pageConfigValueFilePath, userRootDir, configName)
            configSources.push({
              configName,
              configSource: {
                codeFilePath,
                codeEnv
              }
            })
          }
        })

      lines.push('pageConfigs.push({')
      lines.push(`  pageId2: '${pageId2}',`)
      lines.push(`  route: '${route}',`)
      lines.push(`  configSources: {`)
      configSources.forEach(({ configName, configSource }) => {
        lines.push(`    ['${configName}']: {`)
        if ('codeFilePath' in configSource) {
          const { codeFilePath, codeEnv } = configSource
          lines.push(`      codeFilePath: '${codeFilePath}',`)
          lines.push(`      codeEnv: '${codeEnv}',`)
          lines.push(`      loadCodeFile: () => import('${codeFilePath}')`)
        } else {
          const { configFilePath, configValue } = configSource
          lines.push(`      configFilePath: '${configFilePath}',`)
          lines.push(`      configValue: ${JSON.stringify(configValue)}`)
        }
        lines.push(`    },`)
      })
      lines.push(`  }`)
      lines.push('});')
    })

  const code = lines.join('\n')
  return code
}

function resolveConfigValue(
  pageConfigName: string,
  pageConfigFile: PageConfigFile,
  pageConfigFilesAbstract: PageConfigFile[]
): null | { pageConfigValueFilePath: string; pageConfigValue: unknown } {
  const configFiles: PageConfigFile[] = [pageConfigFile, ...pageConfigFilesAbstract]
  for (const configFile of configFiles) {
    const pageConfigValues = getPageConfigValues(configFile)
    const pageConfigValue = pageConfigValues[pageConfigName]
    if (pageConfigValue !== undefined) {
      return { pageConfigValueFilePath: configFile.pageConfigFilePath, pageConfigValue }
    }
  }
  return null
}

function getPageConfigValues(pageConfigFile: PageConfigFile): Record<string, unknown> {
  const { pageConfigFilePath, pageConfigFileExports } = pageConfigFile
      /* TDOO
            assertUsage(
              !(codeExportName in codeExportFileExports),
              `${codeExportFilePath} should have \`export default ${codeExportName}\` instead of \`export { ${codeExportName} }\``
            )
            const invalidExports = Object.keys(codeExportFileExports).filter((e) => e !== 'default')
            assertUsage(
              invalidExports.length === 0,
              `${codeExportFilePath} has \`export { ${invalidExports.join(
                ', '
              )} }\` which is forbidden: it should have a single \`export default\` instead`
            )
            assertUsage('default' in codeExportFileExports, `${codeExportFilePath} should have a \`export default\``)
      */
  assert(Object.keys(pageConfigFileExports).length === 1) // TODO: assertUsage()
  assert('default' in pageConfigFileExports) // TODO: assertUsage()
  const pageConfigValues = pageConfigFileExports.default
  assert(isObject(pageConfigValues))
  return pageConfigValues
}

function isAbstract(pageConfigFile: PageConfigFile): boolean {
  const pageConfigValues = getPageConfigValues(pageConfigFile)
  return !pageConfigValues.Page && !pageConfigValues.route
}

function resolveCodeFilePath(
  configValue: string,
  pageConfigFilePath: string,
  userRootDir: string,
  configName: string
): string {
  const errIntro = `${pageConfigFilePath} sets the config '${configName}' to '${configValue}'`
  const warnArgs = { onlyOnce: true, showStackTrace: false } as const

  if (!isPosixPath(configValue)) {
    assert(configValue.includes('\\'))
    const configValueFixed = toPosixPath(configValue)
    assertWarning(
      false,
      `${errIntro} but it should be '${configValueFixed}' instead (replace backslashes '\' with forward slahes '/')`,
      warnArgs
    )
    configValue = configValueFixed
  }

  const pageConfigDir = path.posix.dirname(pageConfigFilePath)
  let codeFilePath: string
  if (configValue.startsWith('/')) {
    assertWarning(
      false,
      `${errIntro} but it should be a relative path (i.e. a path that starts with './' or '../') that is relative to ${pageConfigDir}`,
      warnArgs
    )
    codeFilePath = configValue
  } else {
    assertPosixPath(configValue)
    assertPosixPath(pageConfigFilePath)
    codeFilePath = path.posix.join(pageConfigDir, configValue)
  }

  assertPosixPath(userRootDir)
  assertPosixPath(codeFilePath)
  let codeFilePathAbsolute = path.posix.join(userRootDir, codeFilePath)
  try {
    codeFilePathAbsolute = require.resolve(codeFilePathAbsolute)
  } catch {
    assertUsage(false, `${errIntro} but a file wasn't found at ${codeFilePathAbsolute}`)
  }

  {
    // It's not possible to omit '../' so we can assume that the path is relative to pageConfigDir
    const configValueFixed = './' + configValue
    assertWarning(
      [
        './',
        '../',
        // Warning for `/` already handled above
        '/'
      ].some((prefix) => configValue.startsWith(prefix)),
      `${errIntro} but it should be '${configValueFixed}' instead (make sure to prefix your paths with './' or '../')`,
      warnArgs
    )
  }
  {
    const filename = path.posix.basename(codeFilePathAbsolute)
    const configValueFixed = path.posix.join(path.posix.dirname(configValue), filename)
    const fileExt = path.posix.extname(filename)
    assertWarning(
      configValue.endsWith(filename),
      `${errIntro} but it should be '${configValueFixed}' instead (don't omit the file extension '${fileExt}')`,
      warnArgs
    )
  }

  assert(codeFilePath.startsWith('/'))
  return codeFilePath
}

/*
// TODO: write error messages
// TODO: is this still needed?
function isValidPageConfigFile(
  pageConfigFileExports: Record<string, unknown>
): pageConfigFileExports is { default: PageConfigValues } {
  return checkPageConfigFile(pageConfigFileExports) === null
}
function checkPageConfigFile(pageConfigFileExports: Record<string, unknown>): null | string {
  assert(isObject(pageConfigFileExports))
  if (!('default' in pageConfigFileExports)) return 'TODO'
  const defaultExport = pageConfigFileExports.default
  if (!isObject(defaultExport)) return 'TODO'
  if (!(defaultExport.onRenderHtml === undefined || typeof defaultExport.onRenderHtml === 'string')) return 'TODO'
  if (!(defaultExport.onRenderClient === undefined || typeof defaultExport.onRenderClient === 'string')) return 'TODO'
  if (!(defaultExport.Page === undefined || typeof defaultExport.Page === 'string')) return 'TODO'
  if (
    !(defaultExport.route === undefined || typeof defaultExport.route === 'string' || isCallable(defaultExport.route))
  )
    return 'TODO'
  return null
}
*/

/* TODO: remove
type PageConfig = {
  onRenderHtml?: string | Function
  onRenderClient?: string | Function
  Page?: string | unknown
} & Record<string, unknown>
type PageConfigFile = {
  filePath: string
  getPageConfig: () => Promise<PageConfig>
  pageId: null | string
  // filesystemId: string
  // loadConfig: () => Promise<void>
  // configValue?: Record<string, unknown>
}

export { resolvePageConfigFile }
function resolvePageConfigFile(filePath: string, loadFile: () => Promise<Record<string, unknown>>): PageConfigFile {
  let pageConfig: null | PageConfig = null
  const pageConfigFile: PageConfigFile = {
    filePath,
    pageId: determinePageId(filePath),
    async getPageConfig() {
      if (!pageConfig) {
        const fileExports = await loadFile()
        pageConfig = resolvePageConfig(fileExports)
      }
      assert(pageConfig)
      return pageConfig
    }
  }
  return pageConfigFile
}
function resolvePageConfig(pageConfigFileExports: Record<string, unknown>): PageConfig {
  // TODO: add validation
  const pageConfigUserDefined = pageConfigFileExports.default
  assert(isObject(pageConfigUserDefined))
  return pageConfigUserDefined
}
  */
