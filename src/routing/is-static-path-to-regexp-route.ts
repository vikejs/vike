import { parseRoute } from './parse-path-to-regexp-route';

export function isStaticRoute(route: string): boolean {
  const { matchValue, routeParams } = parseRoute(route, route)
  return matchValue !== false && Object.keys(routeParams).length === 0
}
