export { loadPageFiles }
export { getPageFilesAllClientSide }
export { getPageFilesAllServerSide }
export type PageContextExports = Awaited<ReturnType<typeof loadPageFiles>>
export type { PageFile }
export { setPageFilesServerSide }
export { setPageFilesClientSide }
export { setPageFilesServerSideAsync }
export { getStringUnion }

import {
  assert,
  hasProp,
  isBrowser,
  isCallable,
  isObject,
  assertPosixPath,
  cast,
  assertWarning,
  assertUsage,
  unique,
  slice,
} from './utils'
import { isErrorPage } from './route'
import { determinePageId } from './determinePageId'

assertNotAlreadyLoaded()

const fileTypes = ['.page', '.page.server', '.page.route', '.page.client'] as const
type FileType = typeof fileTypes[number]
type PageFile = {
  filePath: string
  fileType: FileType
  fileExports?: Record<string, unknown>
  loadFileExports?: () => Promise<void>
  meta?: Record<string, unknown>
  loadMeta?: () => Promise<void>
  isRelevant: (pageId: string) => boolean
  isDefaultPageFile: boolean
  isRendererPageFile: boolean
  isErrorPageFile: boolean
  pageId: string
}

let _pageFilesAll: PageFile[] | undefined
let _pageFilesGetter: () => Promise<void> | undefined

function setPageFilesServerSide(pageFilesExports: unknown) {
  _pageFilesAll = format(pageFilesExports)
}
function setPageFilesServerSideAsync(getPageFilesExports: () => Promise<unknown>) {
  _pageFilesGetter = async () => {
    setPageFilesClientSide(await getPageFilesExports())
  }
}
function setPageFilesClientSide(pageFilesExports: unknown) {
  _pageFilesAll = format(pageFilesExports)
}

async function getPageFilesAllServerSide(isProduction: boolean) {
  if (_pageFilesGetter) {
    if (
      !_pageFilesAll ||
      // We reload all glob imports in dev to make auto-reload work
      !isProduction
    ) {
      await _pageFilesGetter()
    }
    assert(_pageFilesAll)
  }
  assert(_pageFilesAll)
  const pageFilesAll = _pageFilesAll
  const allPageIds = getAllPageIds(pageFilesAll)
  return { pageFilesAll, allPageIds }
}

function getPageFilesAllClientSide() {
  assert(_pageFilesAll)
  const pageFilesAll = _pageFilesAll
  const allPageIds = getAllPageIds(pageFilesAll)
  return { pageFilesAll, allPageIds }
}

function format(pageFilesExports: unknown) {
  assert(hasProp(pageFilesExports, 'isGeneratedFile'), 'Missing `isGeneratedFile`.')
  assert(pageFilesExports.isGeneratedFile !== false, `vite-plugin-ssr was re-installed(/re-built). Restart your app.`)
  assert(pageFilesExports.isGeneratedFile === true, `\`isGeneratedFile === ${pageFilesExports.isGeneratedFile}\``)
  assert(hasProp(pageFilesExports, 'pageFilesLazy', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesEager', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesMetaLazy', 'object'))
  assert(hasProp(pageFilesExports, 'pageFilesMetaEager', 'object'))
  assert(hasProp(pageFilesExports.pageFilesLazy, '.page'))
  assert(
    hasProp(pageFilesExports.pageFilesLazy, '.page.route') || hasProp(pageFilesExports.pageFilesEager, '.page.route'),
  )
  assert(
    hasProp(pageFilesExports.pageFilesLazy, '.page.client') || hasProp(pageFilesExports.pageFilesLazy, '.page.server'),
  )

  const pageFilesMap: Record<string, PageFile> = {}
  traverse(pageFilesExports.pageFilesLazy, pageFilesMap, (pageFile, globResult) => {
    const loadModule = globResult
    assertLoadModule(loadModule)
    pageFile.loadFileExports = async () => {
      if (!('fileExports' in pageFile)) {
        pageFile.fileExports = await loadModule()
      }
    }
  })
  traverse(pageFilesExports.pageFilesMetaLazy, pageFilesMap, (pageFile, globResult) => {
    const loadModule = globResult
    assertLoadModule(loadModule)
    pageFile.loadMeta = async () => {
      if (!('meta' in pageFile)) {
        pageFile.meta = await loadModule()
      }
    }
  })
  traverse(pageFilesExports.pageFilesEager, pageFilesMap, (pageFile, globResult) => {
    const moduleExports = globResult
    assertModuleExports(moduleExports)
    pageFile.fileExports = moduleExports
  })
  traverse(pageFilesExports.pageFilesMetaEager, pageFilesMap, (pageFile, globResult) => {
    const moduleExports = globResult
    assertModuleExports(moduleExports)
    pageFile.meta = moduleExports
  })

  const pageFiles = Object.values(pageFilesMap)
  pageFiles.forEach(({ filePath }) => {
    assert(!filePath.includes('\\'))
  })

  return pageFiles
}
function assertLoadModule(globResult: unknown): asserts globResult is () => Promise<Record<string, unknown>> {
  assert(isCallable(globResult))
}
function assertModuleExports(globResult: unknown): asserts globResult is Record<string, unknown> {
  assert(isObject(globResult))
}
function traverse(
  globObject: Record<string, unknown>,
  pageFilesMap: Record<string, PageFile>,
  visitor: (pageFile: PageFile, globResult: unknown) => void,
) {
  Object.entries(globObject).forEach(([fileType, globFiles]) => {
    cast<FileType>(fileType)
    assert(fileTypes.includes(fileType))
    assert(isObject(globFiles))
    Object.entries(globFiles).forEach(([filePath, globResult]) => {
      const isRelevant = (pageId: string): boolean =>
        pageFile.pageId === pageId ||
        (pageFile.isDefaultPageFile &&
          (pageFile.isRendererPageFile || isAncestorDefaultPage(pageId, pageFile.filePath)))
      const pageFile = (pageFilesMap[filePath] = pageFilesMap[filePath] ?? {
        filePath,
        fileType,
        isRelevant,
        isDefaultPageFile: isDefaultFilePath(filePath),
        isRendererPageFile: isRendererFilePath(filePath),
        isErrorPageFile: isErrorPage(filePath),
        pageId: determinePageId(filePath),
      })
      visitor(pageFile, globResult)
    })
  })
}

function isDefaultFilePath(filePath: string): boolean {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/'))
  return filePath.includes('/_default')
}
function isRendererFilePath(filePath: string): boolean {
  assertPosixPath(filePath)
  assert(filePath.startsWith('/'))
  return filePath.includes('/renderer/')
}

type ExportsAll = Record<string, { filePath: string; exportValue: unknown }[]>
async function loadPageFiles(pageFilesAll: PageFile[], pageId: string, isForClientSide: boolean) {
  const pageFiles = findPageFilesToLoad(pageFilesAll, pageId, isForClientSide)
  await Promise.all([
    ...pageFiles.map((p) => p.loadFileExports?.()),
    // Load CSS provided by `?extractStyles` transformer
    ...(isForClientSide
      ? pageFilesAll.filter((p) => p.fileType === '.page.server' && p.isRelevant(pageId)).map((p) => p.loadMeta?.())
      : []),
  ])

  const pageExports = createObjectWithDeprecationWarning()
  const exports: Record<string, unknown> = {}
  const exportsAll: ExportsAll = {}
  pageFiles.forEach(({ filePath, fileType, fileExports }) => {
    Object.entries(fileExports ?? {}).forEach(([exportName, exportValue]) => {
      exports[exportName] = exports[exportName] ?? exportValue
      if (fileType === '.page') {
        if (!(exportName in pageExports)) {
          pageExports[exportName] = exportValue
        }
      }
      exportsAll[exportName] = exportsAll[exportName] ?? []
      exportsAll[exportName]!.push({
        filePath,
        exportValue,
      })
    })
  })

  {
    const customExports = getStringUnion(exportsAll, 'customExports')
    assertExports(pageFiles, customExports)
  }

  const pageContextAddendum = {
    exports,
    pageExports,
    exportsAll,
  }
  return pageContextAddendum
}

function findPageFilesToLoad(pageFilesAll: PageFile[], pageId: string, isForClientSide: boolean) {
  const fileTypeEnvSpecific = isForClientSide ? ('.page.client' as const) : ('.page.server' as const)
  const defaultFiles = [
    ...pageFilesAll.filter((p) => p.isDefaultPageFile && p.isRelevant(pageId) && p.fileType === fileTypeEnvSpecific),
    ...pageFilesAll.filter((p) => p.isDefaultPageFile && p.isRelevant(pageId) && p.fileType === '.page'),
  ]
  defaultFiles.sort(defaultFilesSorter(fileTypeEnvSpecific, pageId))
  const pageFiles = [
    ...pageFilesAll.filter((p) => p.pageId === pageId && p.fileType === fileTypeEnvSpecific),
    ...pageFilesAll.filter((p) => p.pageId === pageId && p.fileType === '.page'),
    ...defaultFiles,
  ]
  return pageFiles
}

function defaultFilesSorter(fileTypeEnvSpecific: FileType, pageId: string) {
  const e1First = -1 as const
  const e2First = +1 as const
  const noOrder = 0 as const
  return (e1: PageFile, e2: PageFile): 0 | 1 | -1 => {
    assert(e1.isDefaultPageFile && e2.isDefaultPageFile)

    {
      const e1_isRenderer = e1.isRendererPageFile
      const e2_isRenderer = e2.isRendererPageFile
      if (!e1_isRenderer && e2_isRenderer) {
        return e1First
      }
      if (!e2_isRenderer && !e1_isRenderer) {
        return e2First
      }
      assert(e1_isRenderer === e2_isRenderer)
    }

    {
      const e1_distance = getPathDistance(pageId, e1.filePath)
      const e2_distance = getPathDistance(pageId, e2.filePath)
      if (e1_distance < e2_distance) {
        return e1First
      }
      if (e2_distance < e1_distance) {
        return e2First
      }
      assert(e1_distance === e2_distance)
    }

    {
      if (e1.fileType === fileTypeEnvSpecific && e2.fileType !== fileTypeEnvSpecific) {
        return e1First
      }
      if (e2.fileType === fileTypeEnvSpecific && e1.fileType !== fileTypeEnvSpecific) {
        return e2First
      }
    }

    /*
    {
      if (e1.fileType === '.page' && e2.fileType !== '.page') {
        return e2First
      }
      if (e2.fileType === '.page' && e1.fileType !== '.page') {
        return e1First
      }
    }
    */

    return noOrder
  }
}

function assertNotAlreadyLoaded() {
  // The functionality of this file will fail if it's loaded more than
  // once; we assert that it's loaded only once.
  const alreadyLoaded = Symbol()
  const globalObject: any = isBrowser() ? window : global
  assert(!globalObject[alreadyLoaded])
  globalObject[alreadyLoaded] = true
}

function createObjectWithDeprecationWarning(): Record<string, unknown> {
  return new Proxy(
    {},
    {
      get(...args) {
        assertWarning(
          false,
          '`pageContext.pageExports` is deprecated in favor of `pageContext.exports`, see https://vite-plugin-ssr.com/exports',
          { onlyOnce: true },
        )
        return Reflect.get(...args)
      },
    },
  )
}

type Check = (p: PageFile) => boolean
const routeFile: Check = (p) => p.fileType === '.page.route'
const clientFile: Check = (p) => p.fileType === '.page.client'
const serverFile: Check = (p) => p.fileType === '.page.server'
const defaultFile: Check = (p) => p.isDefaultPageFile
const and: (c1: Check, c2: Check) => Check = (c1, c2) => (p) => c1(p) && c2(p)
const or: (c1: Check, c2: Check) => Check = (c1, c2) => (p) => c1(p) || c2(p)
const not: (c: Check) => Check = (c) => (p) => !c(p)
const VPS_EXPORTS: Record<string, (p: PageFile) => boolean> = {
  // Everywhere (almost)
  default: not(and(routeFile, defaultFile)),
  // Isomorphic
  render: or(clientFile, serverFile),
  onBeforeRender: not(routeFile),
  customExports: and(defaultFile, not(routeFile)), // It doesn't make sense to define a custom export from a `.page.js` file
  // `some.page.route.js`
  iKnowThePerformanceRisksOfAsyncRouteFunctions: and(routeFile, not(defaultFile)),
  // `_default.page.route.js`
  filesystemRoutingRoot: and(routeFile, defaultFile),
  onBeforeRoute: and(routeFile, defaultFile),
  // `some.page.js`
  Page: and(not(defaultFile), not(routeFile)),
  // `*.page.server.js`
  prerender: serverFile,
  passToClient: serverFile,
  // `some.page.server.js`
  doNotPrerender: and(serverFile, not(defaultFile)),
  // `_default.page.server.js`
  onBeforePrerender: and(serverFile, defaultFile),
  // `*.page.client.js`
  clientRouting: clientFile,
  onHydrationEnd: clientFile,
  onPageTransitionStart: clientFile,
  onPageTransitionEnd: clientFile,
  prefetchLinks: clientFile,
}

function assertExports(pageFiles: PageFile[], customExports: string[]) {
  customExports.forEach((customExportName) => {
    assertUsage(
      !Object.keys(VPS_EXPORTS).includes(customExportName),
      `\`export { customExports }\` contains \`${customExportName}\` which is forbidden because it is an '\export\` already used by vite-plugin-ssr.`,
    )
  })
  pageFiles.forEach((p) => {
    Object.keys(p.fileExports ?? {}).forEach((exportName) => {
      if (VPS_EXPORTS[exportName]?.(p)) {
        return
      }
      assertWarning(
        customExports.includes(exportName),
        `Unknown \`export { ${exportName} }\` at ${p.filePath}. See https://vite-plugin-ssr/customExports to define custom exports.`,
        { onlyOnce: `unkown-export-${exportName}` },
      )
    })
  })
}

function getStringUnion(exportsAll: ExportsAll, propName: string): string[] {
  return (
    exportsAll[propName]
      ?.map((e) => {
        assertUsage(
          hasProp(e, 'exportValue', 'string[]'),
          `\`export { ${propName} }\` of ${e.filePath} should be an array of strings.`,
        )
        return e.exportValue
      })
      .flat() ?? []
  )
}

function getAllPageIds(allPageFiles: { filePath: string; isDefaultPageFile: boolean }[]): string[] {
  const fileIds = allPageFiles
    .filter(({ isDefaultPageFile }) => !isDefaultPageFile)
    .map(({ filePath }) => filePath)
    .map(determinePageId)
  const allPageIds = unique(fileIds)
  return allPageIds
}

function getPathDistance(pathA: string, pathB: string): number {
  assertPosixPath(pathA)
  assertPosixPath(pathB)
  assert(pathA.startsWith('/'))
  assert(pathB.startsWith('/'))

  // Index of first different character
  let idx = 0
  for (; idx < pathA.length && idx < pathB.length; idx++) {
    if (pathA[idx] !== pathB[idx]) break
  }

  const pathAWithoutCommon = pathA.slice(idx)
  const pathBWithoutCommon = pathB.slice(idx)

  const distanceA = pathAWithoutCommon.split('/').length
  const distanceB = pathBWithoutCommon.split('/').length

  const distance = distanceA + distanceB

  return distance
}

function isAncestorDefaultPage(pageId: string, defaultPageFilePath: string) {
  assertPosixPath(pageId)
  assertPosixPath(defaultPageFilePath)
  assert(pageId.startsWith('/'))
  assert(defaultPageFilePath.startsWith('/'))
  assert(!pageId.endsWith('/'))
  assert(!defaultPageFilePath.endsWith('/'))
  assert(isDefaultFilePath(defaultPageFilePath))

  const defaultPageDir = slice(defaultPageFilePath.split('/'), 0, -1).join('/')
  return pageId.startsWith(defaultPageDir)
}
