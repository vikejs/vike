export { getPageContextProxyForUser }

import { assertUsage, getGlobalObject } from './utils'
import { notSerializable } from '../shared/notSerializable'
const globalObject = getGlobalObject<{ disableAssertPassToClient?: string }>(
  'preparePageContextForUserConsumptionClientSide.ts',
  {}
)

/**
 * - Throw error when pageContext value isn't serializable
 * - Throw error when pageContext prop is missing in passToClient
 */
function getPageContextProxyForUser<
  T extends Record<string, unknown> & { _pageContextRetrievedFromServer: null | Record<string, unknown> }
>(pageContext: T): T {
  return new Proxy(pageContext, {
    get(_: never, prop: string) {
      const val = pageContext[prop]

      assertUsage(
        val !== notSerializable,
        `pageContext[${JSON.stringify(
          prop
        )}] couldn't be serialized and, therefore, is missing on the client-side. Check the server logs for more information.`
      )

      if (globalObject.disableAssertPassToClient !== prop) {
        assertPassToClient(pageContext._pageContextRetrievedFromServer, prop, isMissing(pageContext, prop))
      }
      // We disable `assertPassToClient` for the next attempt to read `prop`, because of how Vue's reactivity work.
      // (When changing a reactive object, Vue tries to read it's old value first. This triggers a `assertPassToClient()` failure if e.g. `pageContextOldReactive.routeParams = pageContextNew.routeParams` and `pageContextOldReactive` has no `routeParams`.)
      globalObject.disableAssertPassToClient = prop
      window.setTimeout(() => {
        globalObject.disableAssertPassToClient = undefined
      }, 0)

      return val
    }
  })
}

const IGNORE_LIST = [
  'then',
  'toJSON' // Vue tries to get `toJSON`
]
function assertPassToClient(
  pageContextRetrievedFromServer: null | Record<string, unknown>,
  prop: string,
  isMissing: boolean
) {
  if (!isMissing) {
    return
  }
  if (pageContextRetrievedFromServer === null) {
    // If we didn't receive any `pageContext` from the server
    // - passToClient is irrelevant
    // - We cannot determine passToClientInferred
    return
  }
  const propName = JSON.stringify(prop)
  assertUsage(
    false,
    `pageContext[${propName}] isn't available on the client-side because ${propName} is missing in passToClient, see https://vite-plugin-ssr.com/passToClient`
  )
}

function isMissing(pageContext: Record<string, unknown>, prop: string) {
  if (prop in pageContext) return false
  if (IGNORE_LIST.includes(prop)) return false
  if (typeof prop === 'symbol') return false // Vue tries to access some symbols
  if (typeof prop !== 'string') return false
  if (prop.startsWith('__v_')) return false // Vue internals upon `reactive(pageContext)`
  return true
}
