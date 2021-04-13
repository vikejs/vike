import { assert, assertUsage, parseUrl } from './utils'
import { matchRoutes as matchPathToRegexpRoutes } from './routing/match-path-to-regexp-routes';
import { matchRoutes } from './routing/match-vue-routes';
import { PageId } from './routing/types';
import { normalizeUrl } from './routing/normalize-url';
import { isErrorPage } from './routing/is-error-page';
import { isReservedPageId } from './routing/is-reserved-page-id';
import { loadPageRoutes } from './routing/load-page-routes';
import { compileFunctionalRoutesForUrl } from './routing/compile-functional-routes-for-url';
import { getStaticRoutes } from './routing/get-static-routes';

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

  const functionalRoutes = compileFunctionalRoutesForUrl(Object.values(pageRoutes), url, contextProps);
  const staticRoutes = getStaticRoutes(Object.values(pageRoutes), allPageIds);
    
  const routes = [
    ...functionalRoutes,
    ...staticRoutes
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







