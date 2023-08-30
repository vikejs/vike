export { resolveRouteFunction }
export { assertRouteParams }
export { assertSyncRouting }
export { warnDeprecatedAllowKey }

import { assertPageContextUrlComputedPropsPublic, PageContextUrlComputedProps } from '../UrlComputedProps.js'
import { assert, assertUsage, assertWarning, hasProp, isPlainObject, isPromise, isStringRecord } from './utils.js'
import pc from '@brillout/picocolors'

async function resolveRouteFunction(
  routeFunction: Function,
  pageContext: PageContextUrlComputedProps,
  routeDefinedAt: string
): Promise<null | {
  precedence: number | null
  routeParams: Record<string, string>
}> {
  assertPageContextUrlComputedPropsPublic(pageContext)
  let result: unknown = routeFunction(pageContext)
  assertSyncRouting(result, `The Route Function ${routeDefinedAt}`)
  // TODO/v1-release
  //* We disallow asynchronous routing, because we need to check whether a link is a Vike link in a synchronous fashion before calling ev.preventDefault() in the 'click' event listener
  result = await result
  //*/
  if (result === false) {
    return null
  }
  if (result === true) {
    result = {}
  }
  assertUsage(
    isPlainObject(result),
    `The Route Function ${routeDefinedAt} should return a boolean or a plain JavaScript object, instead it returns \`${
      hasProp(result, 'constructor') ? result.constructor : result
    }\`.`
  )

  if ('match' in result) {
    const { match } = result
    assertUsage(
      typeof match === 'boolean',
      `The \`match\` value returned by the Route Function ${routeDefinedAt} should be a boolean.`
    )
    if (!match) {
      return null
    }
  }

  let precedence = null
  if ('precedence' in result) {
    precedence = result.precedence
    assertUsage(
      typeof precedence === 'number',
      `The \`precedence\` value returned by the Route Function ${routeDefinedAt} should be a number.`
    )
  }

  assertRouteParams(result, `The \`routeParams\` object returned by the Route Function ${routeDefinedAt} should`)
  const routeParams: Record<string, string> = result.routeParams || {}

  assertUsage(
    !('pageContext' in result),
    'Providing `pageContext` in Route Functions is prohibited, see https://vite-plugin-ssr.com/route-function#cannot-provide-pagecontext'
  )

  assert(isPlainObject(routeParams))
  Object.keys(result).forEach((key) => {
    assertUsage(
      key === 'match' || key === 'routeParams' || key === 'precedence',
      `The Route Function ${routeDefinedAt} returned an object with an unknown key \`{ ${key} }\`. Allowed keys: ['match', 'routeParams', 'precedence'].`
    )
  })

  return {
    precedence,
    routeParams
  }
}

// TODO/v1-release: remove, and make routing synchronous (enabling Vike to synchronously check whether a link is a Vike link before even calling ev.preventDefault())
function assertSyncRouting(res: unknown, errPrefix: string) {
  assertWarning(
    !isPromise(res),
    `${errPrefix} returned a promise, but asynchronous routing is deprecated and will be removed in the next major release, see https://vite-plugin-ssr.com/route-function#async`,
    { onlyOnce: true }
  )
}
// TODO/v1-release: remove
function warnDeprecatedAllowKey() {
  const allowKey = pc.cyan('iKnowThePerformanceRisksOfAsyncRouteFunctions')
  assertWarning(false, `${allowKey} is deprecated and will be removed in the next major release`, { onlyOnce: true })
}

function assertRouteParams<T>(
  result: T,
  errPrefix: string
): asserts result is T & { routeParams?: Record<string, string> } {
  assert(errPrefix.endsWith(' should'))
  if (!hasProp(result, 'routeParams')) {
    return
  }
  assert(errPrefix.endsWith(' should'))
  assertUsage(isPlainObject(result.routeParams), `${errPrefix} be a plain JavaScript object.`)
  assertUsage(isStringRecord(result.routeParams), `${errPrefix} only hold string values.`)
}
