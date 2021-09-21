import { findDefaultFiles, findPageFile } from './getPageFiles'
import type { AllPageFiles, PageFile } from './getPageFiles'
import {
  assert,
  assertUsage,
  higherFirst,
  slice,
  hasProp,
  isPlainObject,
  isPromise,
  objectAssign,
  isObjectWithKeys,
  assertExports
} from './utils'
import { addComputedUrlProps } from '../node/renderPage'
// @ts-ignore
import * as pathToRegexp from '@brillout/path-to-regexp'

export { route }
export { loadPageRoutes }
export type { PageRoutes }

export { getAllPageIds }
export { getErrorPageId }
export { isErrorPage }
export { isStaticRoute }

type PageId = string

async function route(pageContext: {
  url: string
  _allPageIds: string[]
  _allPageFiles: AllPageFiles
  _pageRoutes: PageRoutes
  _onBeforeRouteHook: null | OnBeforeRouteHook
}): Promise<{ _pageId: string | null; routeParams: Record<string, string> } & Record<string, unknown>> {
  addComputedUrlProps(pageContext)

  const pageContextAddendum = {}
  const pageContextAddendumHook = await callOnBeforeRouteHook(pageContext)
  if (pageContextAddendumHook !== null) {
    objectAssign(pageContextAddendum, pageContextAddendumHook)
    if (hasProp(pageContextAddendum, '_pageId', 'string') || hasProp(pageContextAddendum, '_pageId', 'null')) {
      // We bypass `vite-plugin-ssr`'s routing
      return {
        ...pageContextAddendum,
        routeParams: pageContextAddendum.routeParams || {}
      }
    }
    // We already assign so that `pageContext.url === pageContextAddendum.url`; enabling the `onBeforeRoute()` hook to mutate `pageContext.url` before routing.
    objectAssign(pageContext, pageContextAddendum)
  }

  // `vite-plugin-ssr`'s routing
  const allPageIds = pageContext._allPageIds
  assert(allPageIds.length >= 0)
  assertUsage(
    allPageIds.length > 0,
    'No `*.page.js` file found. You must create a `*.page.js` file, e.g. `pages/index.page.js` (or `pages/index.page.{jsx, tsx, vue, ...}`).'
  )
  const { urlPathname } = pageContext
  assert(urlPathname.startsWith('/'))

  const routeResults = await Promise.all(
    pageContext._pageRoutes.map(async (pageRoute) => {
      const { pageId, filesystemRoute, pageRouteFile } = pageRoute
      assertUsage(
        !isReservedPageId(pageId),
        "Only `_default.page.*` and `_error.page.*` files are allowed to include the special character `_` in their path. The following shouldn't include `_`: " +
          pageId
      )

      if (pageRouteFile) {
        const pageRouteFileExports = pageRouteFile.fileExports
        const pageRouteFilePath = pageRouteFile.filePath

        // Route with Route String defined in `.page.route.js`
        if (hasProp(pageRouteFileExports, 'default', 'string')) {
          const { matchValue, routeParams } = resolveRouteString(pageRouteFileExports, urlPathname, pageRouteFilePath)
          return { pageId, matchValue, routeParams }
        }

        // Route with Route Function defined in `.page.route.js`
        if (hasProp(pageRouteFileExports, 'default', 'function')) {
          const { matchValue, routeParams } = await resolveRouteFunction(
            pageRouteFileExports,
            urlPathname,
            pageContext,
            pageRouteFilePath
          )
          return { pageId, matchValue, routeParams }
        }

        assert(false)
      }

      const { matchValue, routeParams } = routeWith_filesystem(urlPathname, filesystemRoute)
      return { pageId, matchValue, routeParams }
    })
  )

  const winner = pickWinner(routeResults)
  // console.log('[Route Match]:', `[${urlPathname}]: ${winner && winner.pageId}`)

  if (!winner) return { _pageId: null, routeParams: {} }

  const { pageId, routeParams } = winner
  assert(isPlainObject(routeParams))
  objectAssign(pageContextAddendum, {
    _pageId: pageId,
    routeParams
  })
  return pageContextAddendum
}

async function callOnBeforeRouteHook(pageContext: {
  url: string
  _allPageIds: string[]
  _pageRoutes: PageRoutes
  _onBeforeRouteHook: null | OnBeforeRouteHook
}): Promise<null | (Record<string, unknown> & { _pageId?: string | null; routeParams?: Record<string, string> })> {
  if (!pageContext._onBeforeRouteHook) {
    return null
  }
  const result = await pageContext._onBeforeRouteHook.onBeforeRoute(pageContext)
  const errPrefix = `The \`onBeforeRoute()\` hook exported by ${pageContext._onBeforeRouteHook.filePath}`

  assertUsage(
    result === null ||
      result === undefined ||
      (isObjectWithKeys(result, ['pageContext'] as const) && hasProp(result, 'pageContext')),
    `${errPrefix} should return \`null\`, \`undefined\`, or a plain JavaScript object \`{ pageContext: { /* ... */ } }\`.`
  )

  if (result === null || result === undefined) {
    return null
  }

  assertUsage(
    hasProp(result, 'pageContext', 'object'),
    `${errPrefix} returned \`{ pageContext }\` but \`pageContext\` should be a plain JavaScript object.`
  )

  if (hasProp(result.pageContext, '_pageId') && !hasProp(result.pageContext, '_pageId', 'null')) {
    const errPrefix2 = `${errPrefix} returned \`{ pageContext: { _pageId } }\` but \`_pageId\` should be`
    assertUsage(hasProp(result.pageContext, '_pageId', 'string'), `${errPrefix2} a string or \`null\``)
    assertUsage(
      pageContext._allPageIds.includes(result.pageContext._pageId),
      `${errPrefix2} one of following values: \`[${pageContext._allPageIds.map((s) => `'${s}'`).join(', ')}]\`.`
    )
  }
  if (hasProp(result.pageContext, 'routeParams')) {
    assertRouteParams(
      result.pageContext,
      `${errPrefix} returned \`{ pageContext: { routeParams } }\` but \`routeParams\` should`
    )
  }

  return result.pageContext
}

function getErrorPageId(allPageIds: string[]): string | null {
  const errorPageIds = allPageIds.filter((pageId) => isErrorPage(pageId))
  assertUsage(
    errorPageIds.length <= 1,
    `Only one \`_error.page.js\` is allowed. Found several: ${errorPageIds.join(' ')}`
  )
  if (errorPageIds.length > 0) {
    const errorPageId = errorPageIds[0]
    assert(errorPageId)
    return errorPageId
  }
  return null
}

function pickWinner<T extends { matchValue: boolean | number }>(routeResults: T[]): T | undefined {
  const candidates = routeResults
    .filter(({ matchValue }) => matchValue !== false)
    .sort(
      higherFirst(({ matchValue }) => {
        assert(matchValue !== false)
        return matchValue === true ? 0 : matchValue
      })
    )

  const winner = candidates[0]

  return winner
}

function routeWith_pathToRegexp(
  urlPathname: string,
  routeString: string
): { matchValue: false | number; routeParams: Record<string, string> } {
  const match = pathToRegexp(urlPathname, { path: routeString, exact: true })
  if (!match) {
    return { matchValue: false, routeParams: {} }
  }
  // The longer the route string, the more likely is it specific
  const matchValue = routeString.length
  const routeParams: Record<string, string> = match.params || {}
  assert(isPlainObject(routeParams))
  return { matchValue, routeParams }
}

function isStaticRoute(route: string): boolean {
  const { matchValue, routeParams } = routeWith_pathToRegexp(route, route)
  return matchValue !== false && Object.keys(routeParams).length === 0
}

function routeWith_filesystem(
  urlPathname: string,
  filesystemRoute: string
): { matchValue: boolean; routeParams: Record<string, string> } {
  urlPathname = removeTrailingSlash(urlPathname)
  // console.log('[Route Candidate] url:' + urlPathname, 'filesystemRoute:' + filesystemRoute)
  assert(urlPathname.startsWith('/'))
  assert(filesystemRoute.startsWith('/'))
  assert(!urlPathname.endsWith('/') || urlPathname === '/')
  assert(!filesystemRoute.endsWith('/') || filesystemRoute === '/')
  const matchValue = urlPathname === filesystemRoute
  return { matchValue, routeParams: {} }
}
function removeTrailingSlash(url: string) {
  if (url === '/' || !url.endsWith('/')) {
    return url
  } else {
    return slice(url, 0, -1)
  }
}
function getFilesystemRoute(pageId: string, filesystemRoots: { rootPath: string; rootValue: string }[]): string {
  // Handle Filesystem Routing Root
  const filesystemRootsMatch = filesystemRoots
    .filter(({ rootPath }) => pageId.startsWith(rootPath))
    .sort(higherFirst(({ rootPath }) => rootPath.length))
  const root = filesystemRootsMatch[0]
  let pageRoute = pageId
  if (root) {
    const { rootPath, rootValue } = root
    assert(pageRoute.startsWith(rootPath))
    pageRoute = slice(pageRoute, rootPath.length, 0)
    assert(pageRoute.startsWith('/'))
    pageRoute = rootValue + (rootValue.endsWith('/') ? '' : '/') + slice(pageRoute, 1, 0)
  }

  // Remove `pages/`, `index/, and `src/`, directories
  pageRoute = pageRoute.split('/pages/').join('/')
  pageRoute = pageRoute.split('/src/').join('/')
  pageRoute = pageRoute.split('/index/').join('/')

  // Hanlde `/index.page.*` suffix
  assert(!pageRoute.includes('.page.'))
  if (pageRoute.endsWith('/index')) {
    pageRoute = slice(pageRoute, 0, -'/index'.length)
  }

  if (pageRoute === '') {
    pageRoute = '/'
  }
  assert(pageRoute.startsWith('/'))

  return pageRoute
}

/**
  Returns the ID of all pages including `_error.page.*` but excluding `_default.page.*`.
*/
async function getAllPageIds(allPageFiles: AllPageFiles): Promise<PageId[]> {
  const pageFileIds = computePageIds(allPageFiles['.page'])
  const pageClientFileIds = computePageIds(allPageFiles['.page.client'])
  const pageServerFileIds = computePageIds(allPageFiles['.page.server'])

  const allPageIds = unique([...pageFileIds, ...pageClientFileIds, ...pageServerFileIds])

  allPageIds.forEach((pageId) => {
    assertUsage(
      pageFileIds.includes(pageId) || pageServerFileIds.includes(pageId),
      `File missing. You need to create at least \`${pageId}.page.server.js\` or \`${pageId}.page.js\`.`
    )
    assertUsage(
      pageFileIds.includes(pageId) || pageClientFileIds.includes(pageId),
      `File missing. You need to create at least \`${pageId}.page.client.js\` or \`${pageId}.page.js\`.`
    )
  })

  return allPageIds
}
function computePageIds(pageFiles: PageFile[]): string[] {
  const fileIds = pageFiles
    .map(({ filePath }) => filePath)
    .filter((filePath) => !isDefaultPageFile(filePath))
    .map(computePageId)
  return fileIds
}
function computePageId(filePath: string): string {
  const pageSuffix = '.page.'
  const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix)
  assert(!pageId.includes('\\'))
  return pageId
}
function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

function isDefaultPageFile(filePath: string): boolean {
  assert(!filePath.includes('\\'))
  if (!filePath.includes('/_default')) {
    return false
  }
  assertUsage(
    filePath.includes('_default.page.client.') || filePath.includes('_default.page.server.'),
    `\`_default.*\` file should be either \`_default.page.client.*\` or \`_default.page.server.*\` but we got: ${filePath}`
  )
  return true
}

function resolveRouteString(pageRouteFileExports: { default: string }, urlPathname: string, pageRouteFilePath: string) {
  const routeString: string = pageRouteFileExports.default
  assert(typeof pageRouteFilePath === 'string')
  assertUsage(
    routeString.startsWith('/'),
    `A Route String should start with a leading \`/\` but \`${pageRouteFilePath}\` has \`export default '${routeString}'\`. Make sure to \`export default '/${routeString}'\` instead.`
  )
  return routeWith_pathToRegexp(urlPathname, routeString)
}
async function resolveRouteFunction(
  pageRouteFileExports: { default: Function; iKnowThePerformanceRisksOfAsyncRouteFunctions?: boolean },
  urlPathname: string,
  pageContext: Record<string, unknown>,
  pageRouteFilePath: string
): Promise<{
  matchValue: boolean | number
  routeParams: Record<string, string>
}> {
  const routeFunction: Function = pageRouteFileExports.default
  let result = routeFunction({ url: urlPathname, pageContext })
  assertUsage(
    !isPromise(result) || pageRouteFileExports.iKnowThePerformanceRisksOfAsyncRouteFunctions,
    `The Route Function ${pageRouteFilePath} returned a promise. Async Route Functions may significantly slow down your app: every time a page is rendered the Route Functions of *all* your pages are called and awaited for. A slow Route Function will slow down all your pages. If you still want to define an async Route Function then \`export const iKnowThePerformanceRisksOfAsyncRouteFunctions = true\` in \`${pageRouteFilePath}\`.`
  )
  result = await result
  if ([true, false].includes(result)) {
    result = { match: result }
  }
  assertUsage(
    isPlainObject(result),
    `The Route Function ${pageRouteFilePath} should return a boolean or a plain JavaScript object, instead it returns \`${
      result && result.constructor
    }\`.`
  )
  if (!hasProp(result, 'match')) {
    result['match'] = true
  }
  assert(hasProp(result, 'match'))
  assertUsage(
    typeof result.match === 'boolean' || typeof result.match === 'number',
    `The \`match\` value returned by the Route Function ${pageRouteFilePath} should be a boolean or a number.`
  )
  assertRouteParams(result, `The \`routeParams\` object returned by the Route Function ${pageRouteFilePath} should`)
  const routeParams: Record<string, string> = result.routeParams || {}
  Object.keys(result).forEach((key) => {
    assertUsage(
      key === 'match' || key === 'routeParams',
      `The Route Function ${pageRouteFilePath} returned an object with an unknown key \`{ ${key} }\`. Allowed keys: ['match', 'routeParams'].`
    )
  })
  assert(isPlainObject(routeParams))
  return {
    matchValue: result.match,
    routeParams
  }
}

function assertRouteParams<T>(
  result: T,
  errPrefix: string
): asserts result is T & { routeParams?: Record<string, string> } {
  assert(errPrefix.endsWith(' should'))
  if (!hasProp(result, 'routeParams')) {
    return
  }
  assertUsage(isPlainObject(result.routeParams), `${errPrefix} be a plain JavaScript object.`)
  assertUsage(
    Object.values(result.routeParams).every((val) => typeof val === 'string'),
    `${errPrefix} only hold string values.`
  )
}

type RouteValue = string | Function

type PageRoutes = {
  pageId: string
  pageRouteFile?: {
    filePath: string
    fileExports: PageRouteExports
    routeValue: RouteValue
  }
  filesystemRoute: string
}[]

type OnBeforeRouteHook = {
  filePath: string
  onBeforeRoute: (pageContext: { url: string } & Record<string, unknown>) => unknown
}

type PageRouteExports = {
  default: RouteValue
  iKnowThePerformanceRisksOfAsyncRouteFunctions?: boolean
} & Record<string, unknown>
async function loadPageRoutes(globalContext: {
  _allPageFiles: AllPageFiles
  _allPageIds: string[]
}): Promise<{ pageRoutes: PageRoutes; onBeforeRouteHook: null | OnBeforeRouteHook }> {
  let onBeforeRouteHook: null | OnBeforeRouteHook = null
  const filesystemRoots: { rootPath: string; rootValue: string }[] = []
  const defaultPageRouteFiles = findDefaultFiles(globalContext._allPageFiles['.page.route'])
  await Promise.all(
    defaultPageRouteFiles.map(async ({ filePath, loadFile }) => {
      const fileExports = await loadFile()
      assertExportsOfDefaulteRoutePage(fileExports, filePath)
      if ('onBeforeRoute' in fileExports) {
        assertUsage(
          hasProp(fileExports, 'onBeforeRoute', 'function'),
          `The \`onBeforeRoute\` export of \`${filePath}\` should be a function.`
        )
        const { onBeforeRoute } = fileExports
        onBeforeRouteHook = { filePath, onBeforeRoute }
      }
      if ('filesystemRoutingRoot' in fileExports) {
        assertUsage(
          hasProp(fileExports, 'filesystemRoutingRoot', 'string'),
          `The \`filesystemRoutingRoot\` export of \`${filePath}\` should be a string.`
        )
        filesystemRoots.push({
          rootPath: dirname(filePath),
          rootValue: fileExports.filesystemRoutingRoot
        })
      }
    })
  )

  const allPageIds = globalContext._allPageIds
  const pageRoutes: PageRoutes = []
  await Promise.all(
    allPageIds
      .filter((pageId) => !isErrorPage(pageId))
      .map(async (pageId) => {
        const filesystemRoute = getFilesystemRoute(pageId, filesystemRoots)
        assert(filesystemRoute.startsWith('/'))
        assert(!filesystemRoute.endsWith('/') || filesystemRoute === '/')
        const pageRoute = {
          pageId,
          filesystemRoute
        }

        const pageRouteFile = findPageFile(globalContext._allPageFiles['.page.route'], pageId)
        if (pageRouteFile) {
          const { filePath, loadFile } = pageRouteFile
          const fileExports = await loadFile()
          assertExportsOfRoutePage(fileExports, filePath)
          assertUsage('default' in fileExports, `${filePath} should have a default export.`)
          assertUsage(
            hasProp(fileExports, 'default', 'string') || hasProp(fileExports, 'default', 'function'),
            `The default export of ${filePath} should be a string or a function.`
          )
          assertUsage(
            !('iKnowThePerformanceRisksOfAsyncRouteFunctions' in fileExports) ||
              hasProp(fileExports, 'iKnowThePerformanceRisksOfAsyncRouteFunctions', 'boolean'),
            `The export \`iKnowThePerformanceRisksOfAsyncRouteFunctions\` of ${filePath} should be a boolean.`
          )
          const routeValue: RouteValue = fileExports.default
          objectAssign(pageRoute, {
            pageRouteFile: { filePath, fileExports, routeValue }
          })
          pageRoutes.push(pageRoute)
        } else {
          pageRoutes.push(pageRoute)
        }
      })
  )

  return { pageRoutes, onBeforeRouteHook }
}

function isReservedPageId(pageId: string): boolean {
  assert(!pageId.includes('\\'))
  return pageId.includes('/_')
}
function isErrorPage(pageId: string): boolean {
  assert(!pageId.includes('\\'))
  return pageId.includes('/_error')
}

function dirname(filePath: string): string {
  assert(filePath.startsWith('/'))
  assert(!filePath.endsWith('/'))
  const paths = filePath.split('/')
  const dirPath = slice(paths, 0, -1).join('/')
  assert(dirPath.startsWith('/'))
  assert(!dirPath.endsWith('/') || dirPath === '/')
  return dirPath
}

function assertExportsOfRoutePage(fileExports: Record<string, unknown>, filePath: string) {
  assertExports(fileExports, filePath, ['default', 'iKnowThePerformanceRisksOfAsyncRouteFunctions'])
}
function assertExportsOfDefaulteRoutePage(fileExports: Record<string, unknown>, filePath: string) {
  assertExports(fileExports, filePath, ['onBeforeRoute', 'filesystemRoutingRoot'], {
    ['_onBeforeRoute']: 'onBeforeRoute'
  })
}
