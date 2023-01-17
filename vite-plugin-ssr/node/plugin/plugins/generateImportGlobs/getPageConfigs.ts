// export { getPageConfigsFromGlob }
// export { getPageConfigs }
//export { isValidPageConfigFile }
export { generatePageConfigsDataCode }

// TODO: ensure that `route` isn't a file path but a route string (same for onBeforeRoute)
// TODO: Stop server-side runtime from importing this file?

import {
  determinePageId2,
  determineRouteFromFilesystemPath
} from '../../../../shared/route/deduceRouteStringFromFilesystemPath'
import { assertPosixPath, assert, isObject, assertUsage, isCallable } from '../../utils'
// import path from 'path' // TODO: can we use move this file from shared/ to node/ and then use path?

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

/*
function getPageConfigsFromGlob(
  globResult: Record<string, unknown>,
  pageCodeLoaders: Record<string, unknown>
): PageConfig[] {
  const pageConfigFiles: PageConfigFile[] = []
  Object.entries(globResult).forEach(([pageConfigFilePath, pageConfigFileExports]) => {
    assert(isObject(pageConfigFileExports))
    {
      const configeErr = checkPageConfigFile(pageConfigFileExports)
      if (configeErr) {
        assertUsage(false, configeErr)
      }
    }
    assert(isValidPageConfigFile(pageConfigFileExports))
    const pageConfigValues: PageConfigValues = pageConfigFileExports.default
    pageConfigFiles.push({
      pageConfigFilePath,
      pageConfigValues
    })
  })

  const pageConfigsInfo = getPageConfigs(pageConfigFiles)
  const pageConfigs = pageConfigsInfo.map((pageConfigInfo) => {
    const pageConfig: PageConfig = {
      ...pageConfigInfo,
      codeExports: null,
      async loadCode() {
        const codeExports: CodeExport[] = []

        {
          const load = pageCodeLoaders[pageConfigInfo.pageId2]
          assert(isCallable(load))
          const codeExportsUntyped: unknown = await load()
          assert(Array.isArray(codeExportsUntyped))
          codeExportsUntyped.forEach((codeExport) => {
            assert(isObject(codeExport))
            const { codeExportName, codeExportFilePath, codeExportFileExports } = codeExport
            assert(isObject(codeExportFileExports))
            assert(typeof codeExportName === 'string')
            assert(typeof codeExportFilePath === 'string')
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
            codeExports.push({
              codeExportName,
              codeExportFilePath,
              codeExportValue: codeExportFileExports.default
            })
          })
        }

        // TODO: rename codeExports
        {
          directConfigs.forEach((configName) => {
            for (const { pageConfigFilePath, pageConfigValues } of pageConfigFiles) {
              const codeExportValue = pageConfigValues[configName]
              if (codeExportValue !== undefined) {
                codeExports.push({
                  codeExportName: configName, // Unify naming
                  codeExportFilePath: pageConfigFilePath,
                  codeExportValue: pageConfigValues[configName]
                })
                break
              }
            }
          })
        }

        pageConfig.codeExports = codeExports
      }
    }
    return pageConfig
  })

  return pageConfigs
}
*/

/*
function getPageConfigs(pageConfigFiles: PageConfigFile[]): PageConfigInfo[] {
  if (pageConfigFiles.length === 0) return [] // temporary

  const pageConfigsInfo: PageConfigInfo[] = []

  const pageConfigFilesAbstract = pageConfigFiles.filter((p) => isAbstract(p))
  assert(pageConfigFilesAbstract.length === 1) // TODO
  const pageConfigFileAbstract = pageConfigFilesAbstract[0]!
  pageConfigFiles
    .filter((p) => !isAbstract(p))
    .forEach((pageConfigFile) => {
      const { pageConfigFilePath, pageConfigValues } = pageConfigFile

      const onRenderHtml = resolveConfigValue2(pageConfigFile, pageConfigFilesAbstract, 'onRenderHtml')
      assert(onRenderHtml) // TODO: assertUsage()
      const onRenderClient = resolveConfigValue2(pageConfigFile, pageConfigFilesAbstract, 'onRenderClient')
      assert(onRenderClient) // TODO: assertUsage()
      const passToClient = resolveConfigValue2(pageConfigFile, pageConfigFilesAbstract, 'passToClient')
      const onBeforeRender = resolveConfigValue2(pageConfigFile, pageConfigFilesAbstract, 'onBeforeRender')
      const onBeforeRoute = resolveConfigValue2(pageConfigFile, pageConfigFilesAbstract, 'onBeforeRoute')
      const iKnowThePerformanceRisksOfAsyncRouteFunctions = resolveConfigValue2(
        pageConfigFile,
        pageConfigFilesAbstract,
        'iKnowThePerformanceRisksOfAsyncRouteFunctions'
      )

      let Page = pageConfigValues.Page
      if (Page) Page = resolveCodeFilePath(Page, pageConfigFilePath)

      const route =
        pageConfigValues.route || // TODO: assertUsage that route isn't a path
        determineRouteFromFilesystemPath(pageConfigFilePath)

      const pageId2 = determinePageId2(pageConfigFilePath)

      pageConfigsInfo.push({
        pageId2,
        pageConfigFiles: [pageConfigFile, pageConfigFileAbstract], // TODO: there can be several abstract page configs + ensure order is right (specific first)
        onRenderHtml,
        onRenderClient,
        Page,
        route,
        onBeforeRoute,
        onBeforeRender,
        passToClient,
        iKnowThePerformanceRisksOfAsyncRouteFunctions
      })
    })

  return pageConfigsInfo
}
*/

async function generatePageConfigsDataCode(userRootDir: string, isForClientSide: boolean): Promise<string> {
  const result = await loadPageConfigFiles(userRootDir)

  if ('hasError' in result) {
    return 'export const pageConfigsData = null;'
  }

  const { pageConfigFiles } = result

  const lines: string[] = []

  lines.push('export const pageConfigsData = [];')

  const pageConfigFilesAbstract = pageConfigFiles.filter((p) => isAbstract(p))
  pageConfigFiles
    .filter((p) => !isAbstract(p))
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
            const codeFilePath = resolveCodeFilePath(pageConfigValue, pageConfigValueFilePath)
            configSources.push({
              configName,
              configSource: {
                codeFilePath,
                codeEnv
              }
            })
          }
        })

      lines.push('')
      lines.push('pageConfigs.push({')
      lines.push(`  pageId2: '${pageId2}',`)
      lines.push(`  route: '${route}',`)
      lines.push(`  configSources: {`)
      configSources.forEach(({ configName, configSource }) => {
        lines.push(`    ['${configName}']: {`)
        if ('codeFilePath' in configSource) {
          const { codeFilePath, codeEnv } = configSource
          lines.push(`      codeFilePath: () => '${codeFilePath}',`)
          lines.push(`      codeEnv: () => '${codeEnv}',`)
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

// TODO: remove
/*
function resolveConfigValue2<K extends keyof PageConfigValues>(
  pageConfigFile: PageConfigFile,
  pageConfigFilesAbstract: PageConfigFile[],
  pageConfigName: K
): PageConfigValues[K] | undefined {
  let pageConfigValue: PageConfigValues[K] | undefined = undefined
  for (const { pageConfigFilePath, pageConfigValues } of [pageConfigFile, ...pageConfigFilesAbstract]) {
    pageConfigValue = pageConfigValues[pageConfigName]
    if (pageConfigValue !== undefined) {
      if ((filePathConfigs as readonly string[]).includes(pageConfigName)) {
        assert(typeof pageConfigValue === 'string') // TODO: assertUsage()
        pageConfigValue = resolveCodeFilePath(pageConfigValue, pageConfigFilePath) as any
      }
      break
    }
  }
  return pageConfigValue
}
*/

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

/*
function resolvePathOptional(configValuePath: string | undefined, pageConfigFilePath: string): string | undefined {
  if (configValuePath === undefined) return undefined
  return resolveCodeFilePath(configValuePath, pageConfigFilePath)
}
*/
function resolveCodeFilePath(configValuePath: string, pageConfigFilePath: string): string {
  assertPosixPath(configValuePath) // TODO: assertUsage()
  assertPosixPath(pageConfigFilePath)
  assert(pageConfigFilePath.startsWith('/pages/'), pageConfigFilePath) // TODO: remove
  let p = pathJoin(pathDirname(pageConfigFilePath), configValuePath)
  assert(p.startsWith('/'), p)
  assert(p.startsWith('/pages/'), p) // TODO: remove
  return p
}

// TODO: Not needed anymore
// Node.js code/shim: https://github.com/jinder/path
function pathDirname(path_: string): string {
  const { isAbsolute, parts } = parsePath(path_)
  assert(isAbsolute)
  const fileDir = '/' + parts.slice(0, -1).join('/')
  assert(!fileDir.endsWith('/'))
  return fileDir
}
function pathJoin(path1: string, path2: string): string {
  assert(!path2.startsWith('..')) // TODO
  const { isAbsolute, parts } = parsePath(path1)
  let path_ = [...parts, ...parsePath(path2).parts].join('/')
  if (isAbsolute) path_ = '/' + path_
  return path_
}
function parsePath(path_: string) {
  assertPosixPath(path_)
  const isAbsolute = path_.startsWith('/')
  let parts = path_.split('/').filter(Boolean)
  if (parts[0] === '.') parts = parts.slice(1)
  return { isAbsolute, parts }
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
