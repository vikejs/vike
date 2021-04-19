import { assert, assertUsage, parseUrl, isCallable, hasProp } from './utils'
import { matchRoutes as matchPathToRegexpRoutes } from './routing/match-path-to-regexp-routes';
import { matchRoutes } from './routing/match-vue-routes';
import { PageId, PageRoute, RouteFunction, RouteFunctionMatch, CompiledRouteFunction } from './routing/types';
import { normalizeUrl } from './utils/normalizeUrl';
import { isErrorPage } from './routing/is-error-page';
import { loadPageRoutes } from './routing/load-page-routes';
import { sortRoutes } from './routing/sort-routes';
import { getFilesystemRoute } from './routing/get-fs-route';

export { route }
export { getErrorPageId }

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

  const compiledRouteFunctions = compileRouteFunctionsForUrl(Object.values(pageRoutes), url, contextProps);
  const routeStrings = getRouteStrings(Object.values(pageRoutes), allPageIds);
    
  const routes = [
    ...compiledRouteFunctions,
    ...routeStrings
  ]

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

function getRouteStrings(routes: PageRoute[], pageIds: PageId[]) {
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

function compileRouteFunctionsForUrl(routes: PageRoute[], url: string, contextProps: Record<string, unknown>): CompiledRouteFunction[] {
  const functionalRoutes : RouteFunction[] = (routes as RouteFunction[])
    .filter(route => isCallable(route.pageRoute))

  const compiledRoutes : CompiledRouteFunction[] = functionalRoutes
    .map(route => {
      assert(route.pageRouteFile);
      const routeFunctionResult : (string|RouteFunctionMatch) = resolveRouteFunction(route.pageRoute, url, contextProps, route.pageRouteFile);
      
      return { ...route, pageRoute: routeFunctionResult };
    });

  return compiledRoutes
    .sort(sortRoutes)
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

function isReservedPageId(pageId: string): boolean {
  assert(!pageId.includes('\\'))
  return pageId.includes('/_')
}
