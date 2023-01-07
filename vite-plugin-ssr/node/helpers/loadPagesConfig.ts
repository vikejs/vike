export { loadPagesConfig }
export { getPageConfigs }

import glob from 'fast-glob'
import path from 'path'
import {
  determinePageId2,
  determineRouteFromFilesystemPath
} from '../../shared/route/deduceRouteStringFromFilesystemPath'
import {
  assertWarning,
  toPosixPath,
  scriptFileExtensions,
  assertPosixPath,
  assert,
  isObject,
  assertUsage,
  isCallable
} from '../utils'
import { loadScript } from './loadScript'

type PageConfigValues = {
  onRenderClient?: string
  onRenderHtml?: string
  passToClient?: string[]
  Page?: string
  route?: string | Function
}
type PageConfigFile = {
  pageConfigFilePath: string
  pageConfigValues: PageConfigValues
}

async function loadPagesConfig(userRootDir: string): Promise<PageConfigFile[]> {
  const pageConfigFilePaths = await findPagesConfigFiles(userRootDir)

  const pageConfigFiles: PageConfigFile[] = []
  // TODO: make esbuild build everyting at once
  await Promise.all(
    pageConfigFilePaths.map(async (pageConfigFilePath) => {
      const pageConfigFileExports = await loadScript(pageConfigFilePath)
      // TODO: don't assert here
      assert(isValidPageConfigFile(pageConfigFileExports))
      const pageConfigValues: PageConfigValues = pageConfigFileExports.default
      pageConfigFiles.push({
        pageConfigFilePath,
        pageConfigValues
      })
    })
  )

  return pageConfigFiles
}

type PageConfig = {
  onRenderClient: string
  onRenderHtml: string
  Page?: string
  route: string | Function
  pageId2: string
}

function getPageConfigs(pageConfigFiles: PageConfigFile[], root: string): PageConfig[] {
  if (pageConfigFiles.length === 0) return [] // temporary

  const pageConfigs: PageConfig[] = []

  const pageConfigFilesAbstract = pageConfigFiles.filter((p) => isAbstract(p))
  assert(pageConfigFilesAbstract.length === 1) // TODO
  const pageConfigFileAbstract = pageConfigFilesAbstract[0]!
  pageConfigFiles
    .filter((p) => !isAbstract(p))
    .forEach(({ pageConfigFilePath, pageConfigValues }) => {
      let onRenderHtml = pageConfigValues.onRenderHtml || pageConfigFileAbstract.pageConfigValues.onRenderHtml
      let onRenderClient = pageConfigValues.onRenderClient || pageConfigFileAbstract.pageConfigValues.onRenderClient
      assert(onRenderHtml)
      assert(onRenderClient)
      onRenderHtml = resolvePath(onRenderHtml, pageConfigFilePath, root)
      onRenderClient = resolvePath(onRenderClient, pageConfigFilePath, root)

      let Page = pageConfigValues.Page
      if (Page) Page = resolvePath(Page, pageConfigFilePath, root)

      const route =
        pageConfigValues.route || // TODO: assertUsage that route isn't a path
        determineRouteFromFilesystemPath(pageConfigFilePath)

      const pageId2 = determinePageId2(pageConfigFilePath)

      pageConfigs.push({
        onRenderHtml,
        onRenderClient,
        Page,
        route,
        pageId2
      })
    })

  return pageConfigs
}

function isAbstract(pageConfigFile: PageConfigFile): boolean {
  return !!(pageConfigFile.pageConfigValues.Page || pageConfigFile.pageConfigValues.route)
}

function resolvePath(configValuePath: string, pageConfigFilePath: string, root: string): string {
  assertPosixPath(configValuePath) // TODO: assertUsage()
  assertPosixPath(root)
  assertPosixPath(pageConfigFilePath)
  assert(pageConfigFilePath.startsWith(root))
  let p = path.posix.join(pageConfigFilePath, configValuePath)
  p = path.relative(root, p)
  assert(!p.startsWith('.') && !p.startsWith('/'))
  p = '/' + p
  return p
}

// TODO
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

function validate() {}

async function findPagesConfigFiles(userRootDir: string): Promise<string[]> {
  assertPosixPath(userRootDir)
  const timeBase = new Date().getTime()
  let configFiles = await glob(`**/+config.${scriptFileExtensions}`, {
    ignore: ['**/node_modules/**'],
    cwd: userRootDir,
    dot: false
  })
  const time = new Date().getTime() - timeBase
  assertWarning(
    time < 2 * 1000,
    `Finding your +config.js files took an unexpected long time (${time}ms). Reach out to the vite-plugin-ssr maintainer.`,
    {
      showStackTrace: false,
      onlyOnce: 'slow-page-files-search'
    }
  )
  configFiles = configFiles.map((p) => path.posix.join(userRootDir, toPosixPath(p)))
  return configFiles
}
