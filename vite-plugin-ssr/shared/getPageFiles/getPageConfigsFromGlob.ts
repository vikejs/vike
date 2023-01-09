export { getPageConfigsFromGlob }
export { getPageConfigs }
export { isValidPageConfigFile }
export { findPageConfig }
export type { PageConfig }
export type { PageConfigFile }
export type { PageConfigValues }

// TODO: ensure that `route` isn't a file path but a route string (same for onBeforeRoute)

import { determinePageId2, determineRouteFromFilesystemPath } from '../route/deduceRouteStringFromFilesystemPath'
import { assertPosixPath, assert, isObject, assertUsage, isCallable } from '../utils'
// import path from 'path' // TODO: can we use move this file from shared/ to node/ and then use path?

const filePathConfigs = ['onRenderHtml', 'onRenderClient', 'onBeforeRoute', 'Page']

type PageConfigRequired = 'onRenderClient' | 'onRenderHtml' | 'route'
type PageConfigInfo = Omit<PageConfigValues, PageConfigRequired> &
  Required<Pick<PageConfigValues, PageConfigRequired>> & {
    pageId2: string
    pageConfigFiles: PageConfigFile[]
  }

type CodeExport = {
  codeExportName: string
  codeExportValue: unknown
  codeExportFilePath: string
}
type PageConfig = PageConfigInfo & {
  loadCode: () => Promise<void>
  codeExports: null | CodeExport[]
}

type PageConfigValues = {
  onRenderClient?: string
  onRenderHtml?: string
  onBeforeRoute?: Function
  onBeforeRender?: Function
  passToClient?: string[]
  Page?: string
  route?: string | Function
  iKnowThePerformanceRisksOfAsyncRouteFunctions?: boolean
}
type PageConfigFile = {
  pageConfigFilePath: string
  pageConfigValues: PageConfigValues
}

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
        const load = pageCodeLoaders[pageConfigInfo.pageId2]
        assert(isCallable(load))
        const codeExports: CodeExport[] = []
        {
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
        pageConfig.codeExports = codeExports
      }
    }
    return pageConfig
  })

  return pageConfigs
}

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

      const onRenderHtml = resolveConfigValue(pageConfigFile, pageConfigFilesAbstract, 'onRenderHtml')
      assert(onRenderHtml) // TODO: assertUsage()
      const onRenderClient = resolveConfigValue(pageConfigFile, pageConfigFilesAbstract, 'onRenderClient')
      assert(onRenderClient) // TODO: assertUsage()
      const passToClient = resolveConfigValue(pageConfigFile, pageConfigFilesAbstract, 'passToClient')
      const onBeforeRender = resolveConfigValue(pageConfigFile, pageConfigFilesAbstract, 'onBeforeRender')
      const onBeforeRoute = resolveConfigValue(pageConfigFile, pageConfigFilesAbstract, 'onBeforeRoute')
      const iKnowThePerformanceRisksOfAsyncRouteFunctions = resolveConfigValue(
        pageConfigFile,
        pageConfigFilesAbstract,
        'iKnowThePerformanceRisksOfAsyncRouteFunctions'
      )

      let Page = pageConfigValues.Page
      if (Page) Page = resolvePath(Page, pageConfigFilePath)

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

function resolveConfigValue<K extends keyof PageConfigValues>(
  pageConfigFile: PageConfigFile,
  pageConfigFilesAbstract: PageConfigFile[],
  pageConfigName: K
): PageConfigValues[K] | undefined {
  let pageConfigValue: PageConfigValues[K] | undefined = undefined
  for (const { pageConfigFilePath, pageConfigValues } of [pageConfigFile, ...pageConfigFilesAbstract]) {
    pageConfigValue = pageConfigValues[pageConfigName]
    if (pageConfigValue !== undefined) {
      if (filePathConfigs.includes(pageConfigName)) {
        assert(typeof pageConfigValue === 'string') // TODO: assertUsage()
        pageConfigValue = resolvePath(pageConfigValue, pageConfigFilePath) as any
      }
      break
    }
  }
  return pageConfigValue
}

function isAbstract(pageConfigFile: PageConfigFile): boolean {
  return !pageConfigFile.pageConfigValues.Page && !pageConfigFile.pageConfigValues.route
}

/*
function resolvePathOptional(configValuePath: string | undefined, pageConfigFilePath: string): string | undefined {
  if (configValuePath === undefined) return undefined
  return resolvePath(configValuePath, pageConfigFilePath)
}
*/
function resolvePath(configValuePath: string, pageConfigFilePath: string): string {
  assertPosixPath(configValuePath) // TODO: assertUsage()
  assertPosixPath(pageConfigFilePath)
  assert(pageConfigFilePath.startsWith('/pages/'), pageConfigFilePath) // TODO: remove
  let p = pathJoin(pathDirname(pageConfigFilePath), configValuePath)
  assert(p.startsWith('/'), p)
  assert(p.startsWith('/pages/'), p) // TODO: remove
  return p
}

// TODO: Maybe not needed if we move this file to node/
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
  const parts = path_.split('/').filter(Boolean)
  return { isAbsolute, parts }
}

// TODO: write error messages
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

function findPageConfig(pageConfigs: PageConfig[], pageId2: string): PageConfig {
  const result = pageConfigs.filter((p) => p.pageId2 === pageId2)
  assert(result.length === 1)
  const pageConfig = result[0]!
  return pageConfig
}
