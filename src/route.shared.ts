import { matchRoutes as matchPathToRegexpRoutes } from './routing/match-path-to-regexp-routes';
import { sortRoutes as defaultSortRoutes } from './routing/sort-routes';
import { PageId, PageRoute, RouteFunction, RouteFunctionMatch, RouteFunctionResult } from './routing/types';
import { getSsrEnv } from './ssrEnv.node';
import { getPageFiles } from './page-files/getPageFiles.shared'
import { assert, assertUsage, isCallable, slice, hasProp, parseUrl } from './utils'

export { getPageIds }
export { route }
export { getErrorPageId }
export { isErrorPage }
export { loadPageRoutes }
export { getFilesystemRoute }

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

  allPageIds
    .filter((pageId) => !isErrorPage(pageId))
    .forEach(pageId => {
      assertUsage(
        !isReservedPageId(pageId),
        "Only `_default.page.*` and `_error.page.*` files are allowed to include the special character `_` in their path. The following shouldn't include `_`: " +
          pageId
      )
    })

  const urlPathname = normalizeUrl(parseUrl(url).pathname)
  assert(urlPathname.startsWith('/'))

  const pageRoutes = await loadPageRoutes()

  const routeFunctionResults = evaluateRouteFunctionsForUrl(Object.values(pageRoutes), url, contextProps);
  const routeStrings = getRouteStrings(Object.values(pageRoutes), allPageIds);
    
  const routes = [
    ...routeFunctionResults,
    ...routeStrings
  ]
  const { customRouting: { matchRoutes=matchPathToRegexpRoutes }={} } = getSsrEnv();

  const result = await matchRoutes(
    routes,
    url    
  )
  if (!result) {
    return null;
  }
  const { pageId, routeParams } = result;
  return { pageId, contextPropsAddendum: { ...routeParams, routeParams, routes } };
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
  const result = routeFunction({ url: urlPathname, contextProps });
  if (typeof result === 'string') {
    // A string will get processed by the underlying matcher
    return result;
  }
  assertUsage(
    typeof result === 'object' && result !== null && result.constructor === Object,
    `The Route Function ${routeFilePath} should return a route string or plain JavaScript object, e.g. \`{ match: true }\`.`
  )
  assertUsage(hasProp(result, 'match'), `The Route Function ${routeFilePath} should return a \`{ match }\` value.`)
  assertUsage(
    typeof result.match === 'boolean' || typeof result.match === 'number',
    `The \`match\` value returned by the Route Function ${routeFilePath} should be a boolean or a number.`
  )
  let routeParams = {}
  if (hasProp(result, 'contextProps')) {
    assertUsage(
      typeof result.contextProps === 'object' &&
        result.contextProps !== null &&
        result.contextProps.constructor === Object,
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
  const { customRouting: { sortRoutes=defaultSortRoutes }={} } = getSsrEnv();
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
  const { customRouting: { sortRoutes=defaultSortRoutes }={} } = getSsrEnv();
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