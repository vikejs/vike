import { PageRoute, FunctionalRoute, FunctionalRouteMatch, CompiledFunctionalRoute } from './types';
import { isCallable, assert, assertUsage, hasProp } from '../utils';
import { sortRoutes } from './sort-routes';

export function compileFunctionalRoutesForUrl(routes: PageRoute[], url: string, contextProps: Record<string, unknown>): CompiledFunctionalRoute[] {
  const functionalRoutes : FunctionalRoute[] = (routes as FunctionalRoute[])
    .filter(route => isCallable(route.pageRoute))

  const compiledRoutes : CompiledFunctionalRoute[] = functionalRoutes
    .map(route => {
      assert(route.pageRouteFile);
      const routeFunctionResult : (string|FunctionalRouteMatch) = resolveRouteFunction(route.pageRoute, url, contextProps, route.pageRouteFile);
      
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
): FunctionalRouteMatch|string {
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
