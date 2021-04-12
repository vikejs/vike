import { assert, assertUsage, isCallable, hasProp, parseUrl } from './utils'
import { matchRoutes } from './routing/match-routes';
import { sortRoutes } from './routing/sort-routes';
import { PageRoute, PageId, FunctionalRouteMatch } from './routing/types';
import { getFilesystemRoute } from './routing/get-fs-route';
import { normalizeUrl } from './routing/normalize-url';
import { isErrorPage } from './routing/is-error-page';
import { isReservedPageId } from './routing/is-reserved-page-id';
import { loadPageRoutes } from './routing/load-page-routes';

export async function route(
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

  const staticPageRoutes : PageRoute[] = allPageIds
    .filter(pageId => !(pageId in pageRoutes) && !isErrorPage(pageId))
    .map(id => ({ pageRoute: getFilesystemRoute(id, allPageIds), id }));

  const result = await matchRoutes(
    [
      ...(
        await Promise.all(
          Object.values(pageRoutes)
            .map(async route => {
              if (isCallable(route.pageRoute)) {
                assert(route.pageRouteFile);
                const routeFunctionResult = await resolveRouteFunction(route.pageRoute, url, contextProps, route.pageRouteFile);
                
                return { ...route, pageRoute: routeFunctionResult };
              }
              return route;
            })
        )
      ),
      ...staticPageRoutes
    ].sort(sortRoutes),
    url    
  )
  if (!result) {
    return null;
  }
  const { pageId, routeParams } = result;
  return { pageId, contextPropsAddendum: { ...routeParams, routeParams } };
}


async function resolveRouteFunction(
  routeFunction: Function,
  urlPathname: string,
  contextProps: Record<string, unknown>,
  routeFilePath: string
): Promise<(FunctionalRouteMatch|string)> {
  const result = routeFunction({ url: urlPathname, contextProps });
  if (typeof result === 'string') {
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







