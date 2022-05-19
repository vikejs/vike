import { assert, assertUsage, hasProp, isPlainObject, isPromise } from './utils'

export { resolveRouteFunction }
export { assertRouteParams }

async function resolveRouteFunction(
  pageRouteFileExports: { default: Function; iKnowThePerformanceRisksOfAsyncRouteFunctions?: boolean },
  urlPathname: string,
  pageContext: Record<string, unknown>,
  pageRouteFilePath: string,
): Promise<
  | { hookError: unknown; hookName: string; hookFilePath: string }
  | null
  | {
      precedence: number | null
      routeParams: Record<string, string>
    }
> {
  const hookFilePath = pageRouteFilePath
  const hookName = 'route()'

  let result: unknown
  try {
    result = pageRouteFileExports.default({ url: urlPathname, pageContext })
  } catch (hookError) {
    return { hookError, hookName, hookFilePath }
  }
  assertUsage(
    !isPromise(result) || pageRouteFileExports.iKnowThePerformanceRisksOfAsyncRouteFunctions,
    `The Route Function ${pageRouteFilePath} returned a promise; async route functions are opt-in, see https://vite-plugin-ssr.com/route-function#async`,
  )
  try {
    result = await result
  } catch (hookError) {
    return { hookError, hookName, hookFilePath }
  }
  if (result === false) {
    return null
  }
  if (result === true) {
    result = {}
  }
  assertUsage(
    isPlainObject(result),
    `The Route Function ${pageRouteFilePath} should return a boolean or a plain JavaScript object, instead it returns \`${
      hasProp(result, 'constructor') ? result.constructor : result
    }\`.`,
  )

  let precedence = null
  if (hasProp(result, 'precedence')) {
    precedence = result.precedence
    assertUsage(
      typeof precedence === 'number',
      `The \`precedence\` value returned by the Route Function ${pageRouteFilePath} should be a number.`,
    )
  }

  assertUsage(
    !('pageContext' in result),
    'Providing `pageContext` in Route Functions is forbidden, see https://vite-plugin-ssr.com/route-function#async',
  )

  assertRouteParams(result, `The \`routeParams\` object returned by the Route Function ${pageRouteFilePath} should`)
  const routeParams: Record<string, string> = result.routeParams || {}
  assert(isPlainObject(routeParams))
  Object.keys(result).forEach((key) => {
    assertUsage(
      key === 'match' || key === 'routeParams' || key === 'precedence',
      `The Route Function ${pageRouteFilePath} returned an object with an unknown key \`{ ${key} }\`. Allowed keys: ['match', 'routeParams', 'precedence'].`,
    )
  })

  return {
    precedence,
    routeParams,
  }
}

function assertRouteParams<T>(
  result: T,
  errPrefix: string,
): asserts result is T & { routeParams?: Record<string, string> } {
  assert(errPrefix.endsWith(' should'))
  if (!hasProp(result, 'routeParams')) {
    return
  }
  assertUsage(isPlainObject(result.routeParams), `${errPrefix} be a plain JavaScript object.`)
  assertUsage(
    Object.values(result.routeParams).every((val) => typeof val === 'string'),
    `${errPrefix} only hold string values.`,
  )
}
