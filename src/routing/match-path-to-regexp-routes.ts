import { RouteMatch, PageRoute, FunctionalRouteMatch } from './types';
import { parseRoute } from './parse-path-to-regexp-route';

export async function matchRoutes(
  routes: PageRoute[],
  url: string
): Promise<null | undefined | RouteMatch> {

  for (var ii = 0; ii < routes.length; ++ii) {
    const route = routes[ii];
    const { pageRoute, id: pageId } = route;

    // Route with `.page.route.js` defined route string
    if (typeof pageRoute === 'string') {
      const { matchValue, routeParams } = parseRoute(url, pageRoute)
      return { pageId, routeParams }
    }

    // Route with `.page.route.js` defined route function
    if (pageRoute.constructor === Object) {
      const { matchValue, routeParams } = pageRoute as FunctionalRouteMatch;
      return { pageId, routeParams }
    }
  }
  return null;
}