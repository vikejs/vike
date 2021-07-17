import { loadPageRoutes, getPageIds, getRouteStrings } from 'vite-plugin-ssr/route.shared'

export async function getRoutes() {
  const [ pageIds, pageRoutes ] = await Promise.all([ getPageIds(), loadPageRoutes() ]);

  const routes = getRouteStrings(Object.entries(pageRoutes).map(([pageId, route]) => ({...route, pageId})), pageIds);

  routes.forEach(route => {
    if (typeof route.pageRoute === 'function') {
      throw new Error('Route functions are not supported when using the Vue Router plugin. Route files should export Vue Router paths only.');
    }
  });

  return routes;
}