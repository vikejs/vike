import { getPageFiles } from './page-files/getPageFiles.shared'
// @ts-ignore
import pathToRegexp from '@brillout/path-to-regexp'
import {
  assert,
  assertUsage,
  slice,
  hasProp,
  getUrlPathname,
  isPlainObject,
  castProp,
  isCallable,
  isPromise
} from './utils'

export { getPageIds }
export { route }
export { getErrorPageId }
export { isErrorPage }
export { loadPageRoutes }
export { getFilesystemRoute }
export { isStaticRoute }
export { getRouteStrings }
export { PageId }
export { PageRoute }
export { RouteMatch }
export { RouteFunctionMatch }
export { RouteFunction }
export { RouteFunctionResult }
export { RoutingHandler }
export { getCustomRouter }
export { setCustomRouter }

type PageId = string

type RouteFunctionMatch = {
  matchValue: boolean | number
  routeParams: Record<string, string>
}

type RouteFunction = PageRoute<Function>;

type RouteFunctionResult = PageRoute<(RouteFunctionMatch|string)>;

type RouteMatch = { 
  routeParams: Record<string, string>, 
  pageId: PageId 
}

type RoutingHandler = {
  matchRoutes: (
    routes: PageRoute[],
    url: string
  ) => Promise<null | undefined | RouteMatch>,
  sortRoutes?: (a: PageRoute, b: PageRoute) => number
}

async function route(
  url: string,
  allPageIds: string[],
  pageContext: Record<string, unknown>
): Promise<null | {
  pageId: PageId
  pageContextAddendum: { routeParams: Record<string, string> } & Record<string, unknown>
}> {
  assertUsage(
    allPageIds.length > 0,
    'No `*.page.js` file found. You must create a `*.page.js` file, e.g. `pages/index.page.js` (or `pages/index.page.{jsx, tsx, vue, ...}`).'
  )
  const pageRouteFiles = await loadPageRouteFiles()

  const urlPathname = getUrlPathname(url)
  assert(urlPathname.startsWith('/'))

  allPageIds
    .filter((pageId) => !isErrorPage(pageId))
    .forEach(pageId => {
      assertUsage(
        !isReservedPageId(pageId),
        "Only `_default.page.*` and `_error.page.*` files are allowed to include the special character `_` in their path. The following shouldn't include `_`: " +
          pageId
      )
    })

  const pageRoutes = Object.fromEntries(
    Object.entries(pageRouteFiles).map(([pageId, { pageRouteFileExports, pageRouteFile }]) => {
      return [pageId, { pageRouteFile, pageRoute: pageRouteFileExports.default, pageId }]
    })
  )

  const routeFunctionResults = await evaluateRouteFunctionsForUrl(Object.values(pageRouteFiles), url, pageContext);
  const routeStrings = getRouteStrings(Object.values(pageRoutes), allPageIds);
    
  const routes = [
    ...routeFunctionResults,
    ...routeStrings
  ]
  const { matchRoutes } = getCustomRouter();
  const result = await matchRoutes(
    routes,
    url    
  )
  if (!result) {
    return null;
  }
  const { pageId, routeParams } = result;
  assert(isPlainObject(routeParams))
  return { pageId, pageContextAddendum: { routeParams } };
}

async function loadPageRoutes(): Promise<Record<PageId, { pageRoute: string | Function; pageRouteFile: string }>> {
  return Object.fromEntries(
    Object.entries(await loadPageRouteFiles()).map(([pageId, { pageRouteFileExports, pageRouteFile }]) => {
      return [pageId, { pageRouteFile, pageRoute: pageRouteFileExports.default, pageId }]
    })
  )
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

/* Note: this is specific to the pathToRegexp implementation and should be moved. Leaving it in place for now. */
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

/* Note: this is specific to the pathToRegexp implementation and should be renamed / moved. Leaving it in place for now. */
function isStaticRoute(route: string): boolean {
  const { matchValue, routeParams } = routeWith_pathToRegexp(route, route)
  return matchValue !== false && Object.keys(routeParams).length === 0
}

function normalizeUrl(urlPathname: string): string {
  return '/' + urlPathname.split('/').filter(Boolean).join('/').toLowerCase()
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
  return commonPath
}

/**
  Returns the ID of all pages including `_error.page.*` but excluding `_default.page.*`.
*/
async function getPageIds(): Promise<PageId[]> {
  const pageViewFiles = await getPageFiles('.page')
  let pageViewFilePaths = pageViewFiles.map(({ filePath }) => filePath)
  pageViewFilePaths = pageViewFilePaths.filter((filePath) => !isDefaultPageFile(filePath))

  let allPageIds = pageViewFilePaths.map(computePageId)
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

async function resolveRouteFunction(
  pageRouteFileExports: { default: Function; iKnowThePerformanceRisksOfAsyncRouteFunctions?: boolean },
  urlPathname: string,
  pageContext: Record<string, unknown>,
  pageRouteFile: string
): Promise<RouteFunctionMatch|string> {
  const routeFunction: Function = pageRouteFileExports.default
  let result = routeFunction({ url: urlPathname, pageContext })
  assertUsage(
    !isPromise(result) || pageRouteFileExports.iKnowThePerformanceRisksOfAsyncRouteFunctions,
    `The Route Function ${pageRouteFile} returned a promise. Async Route Functions may significantly slow down your app: every time a page is rendered the Route Functions of *all* your pages are called and awaited for. A slow Route Function will slow down all your pages. If you still want to define an async Route Function then \`export const iKnowThePerformanceRisksOfAsyncRouteFunctions = true\` in \`${pageRouteFile}\`.`
  )
  result = await result
  if (typeof result === 'string') {
    // A string will get processed by the underlying matcher
    return result;
  }
  if ([true, false].includes(result)) {
    result = { match: result }
  }
  assertUsage(
    isPlainObject(result),
    `The Route Function ${pageRouteFile} should return a boolean or a plain JavaScript object, instead it returns \`${
      result && result.constructor
    }\`.`
  )
  if (!hasProp(result, 'match')) {
    //@TODO figure out why typing is weird here
    (result as {match:boolean}).match = true
  }
  assert(hasProp(result, 'match'))
  assertUsage(
    typeof result.match === 'boolean' || typeof result.match === 'number',
    `The \`match\` value returned by the Route Function ${pageRouteFile} should be a boolean or a number.`
  )
  let routeParams: Record<string, string> = {}
  if (hasProp(result, 'routeParams')) {
    assertUsage(
      isPlainObject(result.routeParams),
      `The \`routeParams\` object returned by the Route Function ${pageRouteFile} should be a plain JavaScript object.`
    )
    assertUsage(
      Object.values(result.routeParams).every((val) => typeof val === 'string'),
      `The \`routeParams\` object returned by the Route Function ${pageRouteFile} should only hold string values.`
    )
    castProp<Record<string, string>, typeof result, 'routeParams'>(result, 'routeParams')
    routeParams = result.routeParams
  }
  Object.keys(result).forEach((key) => {
    assertUsage(
      key === 'match' || key === 'routeParams',
      `The Route Function ${pageRouteFile} returned an object with an unknown key \`{ ${key} }\`. Allowed keys: ['match', 'routeParams'].`
    )
  })
  assert(isPlainObject(routeParams))
  return {
    matchValue: result.match,
    routeParams
  }
}

type PageRouteExports = {
  default: string | Function
  iKnowThePerformanceRisksOfAsyncRouteFunctions?: boolean
} & Record<string, unknown>
type PageRoute<T=string | Function | RouteFunctionMatch> = {
  pageRouteFile?: string
  pageRoute: T
  pageId: PageId
}
type PageRouteFile = {
  pageRouteFile: string
  pageRouteFileExports: PageRouteExports
  pageId: PageId
}
async function loadPageRouteFiles(): Promise<Record<PageId, PageRouteFile>> {
  const userRouteFiles = await getPageFiles('.page.route')

  const pageRoutes: Record<PageId, PageRouteFile> = {}

  await Promise.all(
    userRouteFiles.map(async ({ filePath, loadFile }) => {
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
      const pageRouteFileExports = fileExports
      const pageId = computePageId(filePath)
      const pageRouteFile = filePath

      pageRoutes[pageId] = { pageRouteFileExports, pageRouteFile, pageId }
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

async function evaluateRouteFunctionsForUrl(routes: PageRouteFile[], url: string, pageContext: Record<string, unknown>): Promise<RouteFunctionResult[]> {
  const { sortRoutes } = getCustomRouter();

  const routeFunctionResults : RouteFunctionResult[] = await Promise.all(routes
    .filter(route => typeof route.pageRouteFileExports.default !== 'string')
    .map(async route => {
      assert(route.pageRouteFile);
      const routeFunctionResult : (string|RouteFunctionMatch) = await resolveRouteFunction({
        default: route.pageRouteFileExports.default as Function,
        iKnowThePerformanceRisksOfAsyncRouteFunctions: route.pageRouteFileExports.iKnowThePerformanceRisksOfAsyncRouteFunctions
      }, url, pageContext, route.pageRouteFile);
      
      return { ...route, pageRoute: routeFunctionResult };
    }));

  return routeFunctionResults
    .sort(sortRoutes)
}

function getRouteStrings(routes: PageRoute[], pageIds: PageId[]) {
  const { sortRoutes } = getCustomRouter();

  const fsRouteStrings : PageRoute[] = pageIds
    .filter(pageId => !routes.some(route => route.pageId === pageId) && !isErrorPage(pageId))
    .map(pageId => ({ pageRoute: getFilesystemRoute(pageId, pageIds), pageId }));

  const routeStrings = Object.values(routes)
    .filter(route => !isCallable(route.pageRoute));

  routeStrings.forEach(route => 
    assertUsage(
      (route.pageRoute as string).startsWith('/'),
      `A Route String should start with a leading \`/\` but \`${route}\` has \`export default '${route.pageRoute}'\`. Make sure to \`export default '/${route.pageRoute}'\` instead.`
    )
  );

  return [
    ...fsRouteStrings,
    ...routeStrings
  ].sort(sortRoutes)
}

const getMatchVal = (route: PageRoute): number => 
  typeof route.pageRoute === 'string' 
  ? route.pageRoute.length
  : route.pageRoute.constructor === Object && !isCallable(route.pageRoute)
    ? typeof route.pageRoute.matchValue === 'number'
      ? route.pageRoute.matchValue
      : route.pageRoute.matchValue
        ? 1
        : 0
    : 0;

function defaultSortRoutes(a: PageRoute, b: PageRoute): number {
  return getMatchVal(b) - getMatchVal(a);
}

/* pathToRegexp route handling. These should be moved out (possibly to a separate package). */

async function matchPathToRegexpRoutes(
  routes: PageRoute[],
  url: string
): Promise<null | undefined | RouteMatch> {

  for (var ii = 0; ii < routes.length; ++ii) {
    const route = routes[ii];
    const { pageRoute, pageId } = route;

    // Route with `.page.route.js` defined route string
    if (typeof pageRoute === 'string') {
      const { matchValue, routeParams } = routeWith_pathToRegexp(url, pageRoute)
      return { pageId, routeParams }
    }

    // Route with `.page.route.js` defined route function
    if (pageRoute.constructor === Object) {
      const { matchValue, routeParams } = pageRoute as RouteFunctionMatch;
      return { pageId, routeParams }
    }
  }
  return null;
}

declare global {
  namespace NodeJS {
    interface Global {
      __vite_ssr_plugin_custom_router: RoutingHandler
    }
  }
}

declare global {
  interface Window {
    __vite_ssr_plugin_custom_router: RoutingHandler
  }
}

function getCustomRouter() {
  if( typeof window !== "undefined") {
    // Browser
    return window.__vite_ssr_plugin_custom_router
  } else {
    // Node.js; `global.customRouter` has been set somewhere during the `createPageRender()` call.
    return global.__vite_ssr_plugin_custom_router
  }
}
// @TODO eventually the pathToRegexp implementation should be removed from this file entirely so as not to bloat the bundle when it is unused
function setCustomRouter(customRouter:RoutingHandler = { matchRoutes: matchPathToRegexpRoutes, sortRoutes: defaultSortRoutes }) {
  if( typeof window !== "undefined") {
    // Browser
    return window.__vite_ssr_plugin_custom_router = customRouter
  } else {
    // Node.js; `global.customRouter` has been set somewhere during the `createPageRender()` call.
    return global.__vite_ssr_plugin_custom_router = customRouter
  }
}
