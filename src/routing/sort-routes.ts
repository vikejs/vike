import { PageRoute } from './types';
import { isCallable } from '../utils';

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

export function sortRoutes(a: PageRoute, b: PageRoute): number {
  return getMatchVal(b) - getMatchVal(a);
}