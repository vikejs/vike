import { getSsrEnv } from './ssrEnv.node';
import { getPageFiles } from './page-files/getPageFiles.shared'
// @ts-ignore
import pathToRegexp from '@brillout/path-to-regexp'
import { assert, assertUsage, isCallable, slice, hasProp, getUrlPathname, isPlainObject } from './utils'

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
  routeParams: Record<string, unknown>
}

type RouteFunction = PageRoute<Function>;

type RouteFunctionResult = PageRoute<(RouteFunctionMatch|string)>;

type RouteMatch = { 
  routeParams: Record<string, unknown>, 
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
  contextProps: Record<string, unknown>
): Promise<null | {
  pageId: PageId
  contextPropsAddendum: Record<string, unknown>
}> {
  assertUsage(
    allPageIds.length > 0,
    'No *.page.js file found. You can create a `index.page.js` (or `index.page.jsx`, `index.page.vue`, ...) which will serve `/`.'
  )

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

  const pageRoutes = await loadPageRoutes()

  const routeFunctionResults = evaluateRouteFunctionsForUrl(Object.values(pageRoutes), url, contextProps);
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
  return { pageId, contextPropsAddendum: { routeParams } };
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
  const routeParams = match.params
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
function getFilesystemRoute(pageId: string, allPageIds: string[]): string {
  let pageRoute = removeCommonPrefix(pageId, allPageIds)
  pageRoute = pageRoute
    .split('/')
    .filter((part) => part !== 'index')
    .join('/')
  pageRoute = normalizeUrl(pageRoute)
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

function resolveRouteFunction(
  routeFunction: Function,
  urlPathname: string,
  contextProps: Record<string, unknown>,
  routeFilePath: string
): RouteFunctionMatch|string {
  let result = routeFunction({ url: urlPathname, contextProps })
  if (typeof result === 'string') {
    // A string will get processed by the underlying matcher
    return result;
  }
  if ([true, false].includes(result)) {
    result = { match: result }
  }
  assertUsage(
    isPlainObject(result),
    `The Route Function ${routeFilePath} should return a boolean or a plain JavaScript object, instead it returns \`${
      result && result.constructor
    }\`.`
  )
  if (!hasProp(result, 'match')) {
    result.match = true
  }
  assert(hasProp(result, 'match'))
  assertUsage(
    typeof result.match === 'boolean' || typeof result.match === 'number',
    `The \`match\` value returned by the Route Function ${routeFilePath} should be a boolean or a number.`
  )
  let routeParams = {}
  if (hasProp(result, 'contextProps')) {
    assertUsage(
      isPlainObject(result.contextProps),
      `The \`contextProps\` returned by the Route function ${routeFilePath} should be a plain JavaScript object.`
    )
    routeParams = result.contextProps
  }
  Object.keys(result).forEach((key) => {
    assertUsage(
      key === 'match' || key === 'contextProps',
      `The Route Function ${routeFilePath} returned an object with an unknown key \`{ ${key} }\`. Allowed keys: ['match', 'contextProps'].`
    )
  })
  return {
    matchValue: result.match,
    routeParams
  }
}

type PageRoute<T=string | Function | RouteFunctionMatch> = {
  pageRouteFile?: string
  pageRoute: T
  id: PageId
}
async function loadPageRoutes(): Promise<Record<PageId, PageRoute>> {
  const userRouteFiles = await getPageFiles('.page.route')

  const pageRoutes: Record<PageId, PageRoute> = {}

  await Promise.all(
    userRouteFiles.map(async ({ filePath, loadFile }) => {
      const fileExports = await loadFile()
      assertUsage(hasProp(fileExports, 'default'), `${filePath} should have a default export.`)
      assertUsage(
        typeof fileExports.default === 'string' || isCallable(fileExports.default),
        `The default export of ${filePath} should be a string or a function.`
      )
      const pageRoute = fileExports.default
      const id = computePageId(filePath)
      const pageRouteFile = filePath

      pageRoutes[id] = { pageRoute, pageRouteFile, id }
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

function evaluateRouteFunctionsForUrl(routes: PageRoute[], url: string, contextProps: Record<string, unknown>): RouteFunctionResult[] {
  const { sortRoutes } = getCustomRouter();

  const functionalRoutes : RouteFunction[] = (routes as RouteFunction[])
    .filter(route => isCallable(route.pageRoute))

  const routeFunctionResults : RouteFunctionResult[] = functionalRoutes
    .map(route => {
      assert(route.pageRouteFile);
      const routeFunctionResult : (string|RouteFunctionMatch) = resolveRouteFunction(route.pageRoute, url, contextProps, route.pageRouteFile);
      
      return { ...route, pageRoute: routeFunctionResult };
    });

  return routeFunctionResults
    .sort(sortRoutes)
}

function getRouteStrings(routes: PageRoute[], pageIds: PageId[]) {
  const { sortRoutes } = getCustomRouter();

  const fsRouteStrings : PageRoute[] = pageIds
    .filter(pageId => !routes.some(route => route.id === pageId) && !isErrorPage(pageId))
    .map(id => ({ pageRoute: getFilesystemRoute(id, pageIds), id }));

  const routeStrings = Object.values(routes)
    .filter(route => !isCallable(route.pageRoute));

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
    const { pageRoute, id: pageId } = route;

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
