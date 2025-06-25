export { resolveRouteFunction }
export { assertRouteParams }
export { assertSyncRouting }
export { warnDeprecatedAllowKey }

import type { PageContextUrlInternal } from '../getPageContextUrlComputed.js'
import { execHookDirectSync } from '../hooks/execHook.js'
import { preparePageContextForPublicUsage } from '../preparePageContextForPublicUsage.js'
import { assert, assertUsage, assertWarning, hasProp, isPlainObject, isPromise } from './utils.js'
import pc from '@brillout/picocolors'

async function resolveRouteFunction(
  routeFunction: (arg: unknown) => unknown,
  pageContext: PageContextUrlInternal,
  routeFunctionFilePath: string,
): Promise<null | {
  precedence: number | null
  routeParams: Record<string, string>
}> {
  let { hookReturn: result } = execHookDirectSync(
    {
      hookFn: routeFunction,
      hookFilePath: routeFunctionFilePath,
      hookName: 'route',
    },
    pageContext,
    preparePageContextForPublicUsage,
  )
  assertSyncRouting(result, `The Route Function ${routeFunctionFilePath}`)
  // TO-DO/next-major-release: make resolveRouteFunction() and route() sync
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
    `The Route Function ${routeFunctionFilePath} should return a boolean or a plain JavaScript object (but it's ${pc.cyan(
      `typeof result === ${JSON.stringify(typeof result)}`,
    )} instead)`,
  )

  // AFAICT this return interface is superfluous. Should we soft-deprecate it and remove it?
  if ('match' in result) {
    const { match } = result
    assertUsage(
      typeof match === 'boolean',
      `The ${pc.cyan('match')} value returned by the Route Function ${routeFunctionFilePath} should be a boolean.`,
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
      `The ${pc.cyan('precedence')} value returned by the Route Function ${routeFunctionFilePath} should be a number.`,
    )
  }

  assertRouteParams(
    result,
    `The ${pc.cyan('routeParams')} object returned by the Route Function ${routeFunctionFilePath} should`,
  )
  const routeParams: Record<string, string> = result.routeParams || {}

  assertUsage(
    !('pageContext' in result),
    `Providing ${pc.cyan(
      'pageContext',
    )} in Route Functions is prohibited, see https://vike.dev/route-function#cannot-provide-pagecontext`,
  )

  assert(isPlainObject(routeParams))
  Object.keys(result).forEach((key) => {
    assertUsage(
      key === 'match' || key === 'routeParams' || key === 'precedence',
      `The Route Function ${routeFunctionFilePath} returned an object with an unknown property ${pc.cyan(
        key,
      )} (the known properties are ${pc.cyan('match')}, ${pc.cyan('routeParams')}, and ${pc.cyan('precedence')})`,
    )
  })

  return {
    precedence,
    routeParams,
  }
}

// TO-DO/next-major-release: remove, and make routing synchronous (enabling Vike to synchronously check whether a link is a Vike link before even calling ev.preventDefault())
function assertSyncRouting(res: unknown, errPrefix: string) {
  assertWarning(
    !isPromise(res),
    `${errPrefix} returned a promise, but asynchronous routing is deprecated and will be removed in the next major release, see https://vike.dev/route-function#async`,
    { onlyOnce: true },
  )
}
// TO-DO/next-major-release: remove
function warnDeprecatedAllowKey() {
  const allowKey = pc.cyan('iKnowThePerformanceRisksOfAsyncRouteFunctions')
  assertWarning(false, `${allowKey} is deprecated and will be removed in the next major release`, { onlyOnce: true })
}

function assertRouteParams<T>(
  result: T,
  errPrefix: string,
): asserts result is T & { routeParams?: Record<string, string> } {
  assert(errPrefix.endsWith(' should'))
  if (!hasProp(result, 'routeParams')) {
    return
  }
  assert(errPrefix.endsWith(' should'))
  assertUsage(hasProp(result, 'routeParams', 'string{}'), `${errPrefix} be an object holding string values.`)
}
