import { PageRoute } from './types';
const getMatchVal = (route: PageRoute): number => 
  typeof route.pageRoute === 'string' 
  ? route.pageRoute.length
  : route.pageRoute.constructor === Object && !(typeof route.pageRoute === 'function')
    ? typeof route.pageRoute.matchValue === 'number'
      ? route.pageRoute.matchValue
      : route.pageRoute.matchValue
        ? 1
        : 0
    : 0;

export function sortRoutes(a: PageRoute, b: PageRoute) {
  return getMatchVal(b) - getMatchVal(a);
}