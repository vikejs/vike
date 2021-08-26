import { AllPageFiles, findPageFile } from './getPageFiles'
// @ts-ignore
import pathToRegexp from '@brillout/path-to-regexp'
import {
  assert,
  assertUsage,
  higherFirst,
  slice,
  hasProp,
  getUrlPathname,
  isPlainObject,
  castProp,
  isPromise,
  objectAssign
} from './utils'

export { route }
export { loadPageRoutes }
export type { PageRoutes }

export { getAllPageIds }
export { getErrorPageId }
export { isErrorPage }
export { isStaticRoute }

type PageId = string

async function route(pageContext: {
  urlNormalized: string
  _allPageIds: string[]
  _allPageFiles: AllPageFiles
  _pageRoutes: PageRoutes
}) {
  const allPageIds = pageContext._allPageIds
  assert(allPageIds.length >= 0)
  assertUsage(
    allPageIds.length > 0,
    'No `*.page.js` file found. You must create a `*.page.js` file, e.g. `pages/index.page.js` (or `pages/index.page.{jsx, tsx, vue, ...}`).'
  )
  const urlPathname = getUrlPathname(pageContext.urlNormalized)
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

  if (!winner) return null

  const { pageId, routeParams } = winner
  assert(isPlainObject(routeParams))
  const pageContextRouteAddendum = {
    _pageId: pageId,
    routeParams
  }
  return pageContextRouteAddendum
}

function getErrorPageId(allPageIds: string[]): string | null {
  const errorPageIds = allPageIds.filter((pageId) => isErrorPage(pageId))
  assertUsage(
    errorPageIds.length <= 1,
    `Only one \`_error.page.js\` is allowed. Found several: ${errorPageIds.join(' ')}`
  )
  if (errorPageIds.length > 0) {
    return errorPageIds[0]
  }
  return null
}

function pickWinner<T extends { matchValue: boolean | number }>(routeResults: T[]): T {
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
function getFilesystemRoute(pageId: string, allPageIds: string[]): string {
  let pageRoute = removeCommonPrefix(pageId, allPageIds)
  pageRoute = pageRoute
    .split('/')
    .filter((part) => part !== 'index')
    .join('/')
  if (!pageRoute.startsWith('/')) {
    pageRoute = '/' + pageRoute
  }
  return pageRoute
}
function removeCommonPrefix(pageId: PageId, allPageIds: PageId[]) {
  assert(!isErrorPage(pageId))
  const relevantPageIds = allPageIds.filter((pageId) => !isErrorPage(pageId))
  const commonPrefix = getCommonPath(relevantPageIds)
  assert(pageId.startsWith(commonPrefix))
  return pageId.slice(commonPrefix.length)
}
function getCommonPath(pageIds: string[]): string {
  pageIds.forEach((pageId) => {
    assertUsage(
      !pageId.includes('\\'),
      'Your directory names and file names are not allowed to contain the character `\\`'
    )
    assert(pageId.startsWith('/'))
  })
  const pageIdList = pageIds.concat().sort()
  const first = pageIdList[0]
  const last = pageIdList[pageIdList.length - 1]
  let idx = 0
  for (; idx < first.length; idx++) {
    if (first[idx] !== last[idx]) break
  }
  const commonPrefix = first.slice(0, idx)
  const pathsPart = commonPrefix.split('/')
  assert(pathsPart.length >= 2)
  const commonPath = slice(pathsPart, 0, -1).join('/') + '/'
  assert(commonPath.startsWith('/'))
  return commonPath
}

/**
  Returns the ID of all pages including `_error.page.*` but excluding `_default.page.*`.
*/
async function getAllPageIds(allPageFiles: AllPageFiles): Promise<PageId[]> {
  const pageFiles = allPageFiles['.page']
  let pageFilePaths = pageFiles.map(({ filePath }) => filePath)
  pageFilePaths = pageFilePaths.filter((filePath) => !isDefaultPageFile(filePath))
  const allPageIds = pageFilePaths.map(computePageId)
  return allPageIds
}
function computePageId(filePath: string): string {
  const pageSuffix = '.page.'
  const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix)
  assert(!pageId.includes('\\'))
  return pageId
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
    result.match = true
  }
  assert(hasProp(result, 'match'))
  assertUsage(
    typeof result.match === 'boolean' || typeof result.match === 'number',
    `The \`match\` value returned by the Route Function ${pageRouteFilePath} should be a boolean or a number.`
  )
  let routeParams: Record<string, string> = {}
  if (hasProp(result, 'routeParams')) {
    assertUsage(
      isPlainObject(result.routeParams),
      `The \`routeParams\` object returned by the Route Function ${pageRouteFilePath} should be a plain JavaScript object.`
    )
    assertUsage(
      Object.values(result.routeParams).every((val) => typeof val === 'string'),
      `The \`routeParams\` object returned by the Route Function ${pageRouteFilePath} should only hold string values.`
    )
    castProp<Record<string, string>, typeof result, 'routeParams'>(result, 'routeParams')
    routeParams = result.routeParams
  }
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

type PageRouteExports = {
  default: RouteValue
  iKnowThePerformanceRisksOfAsyncRouteFunctions?: boolean
} & Record<string, unknown>
async function loadPageRoutes(globalContext: {
  _allPageFiles: AllPageFiles
  _allPageIds: string[]
}): Promise<PageRoutes> {
  const allPageIds = globalContext._allPageIds

  const pageRoutes: PageRoutes = []

  await Promise.all(
    allPageIds
    .filter(pageId => !isErrorPage(pageId))
    .map(async (pageId) => {
      const filesystemRoute = getFilesystemRoute(pageId, allPageIds)
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

  return pageRoutes
}

function isReservedPageId(pageId: string): boolean {
  assert(!pageId.includes('\\'))
  return pageId.includes('/_')
}
function isErrorPage(pageId: string): boolean {
  assert(!pageId.includes('\\'))
  return pageId.includes('/_error')
}
