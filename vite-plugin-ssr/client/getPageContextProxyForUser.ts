export { getPageContextProxyForUser }

import { assertUsage, getGlobalObject } from './utils'
import { notSerializable } from '../shared/notSerializable'
const globalObject = getGlobalObject<{ disableAssertPassToClient?: string }>('getPageContextProxyForUser.ts', {})

/**
 * - Throw error when pageContext value isn't serializable
 * - Throw error when pageContext prop is missing in passToClient
 */
function getPageContextProxyForUser<PageContext extends Record<string, unknown> & PageContextInfo>(
  pageContext: PageContext
): PageContext {
  return new Proxy(pageContext, {
    get(_: never, prop: string) {
      const val = pageContext[prop]
      const propName = JSON.stringify(prop)
      assertUsage(
        val !== notSerializable,
        `pageContext[${propName}] couldn't be serialized and, therefore, is missing on the client-side. Check the server logs for more information.`
      )
      assertPassToClient(
        pageContext,
        prop,
        `pageContext[${propName}] isn't available on the client-side because ${propName} is missing in passToClient, see https://vite-plugin-ssr.com/passToClient`
      )
      return val
    }
  })
}

type PageContextInfo = {
  _hasPageContextFromServer: boolean
}
function assertPassToClient(pageContext: PageContextInfo, prop: string, errMsg: string) {
  // We disable assertPassToClient() for the next attempt to read `prop`, because of how Vue's reactivity work.
  //  - (When changing a reactive object, Vue tries to read it's old value first. This triggers a `assertPassToClient()` failure if e.g. `pageContextOldReactive.routeParams = pageContextNew.routeParams` and `pageContextOldReactive` has no `routeParams`.)
  if (globalObject.disableAssertPassToClient === prop) return
  ignoreNextRead(prop)

  if (!isMissing(pageContext, prop)) {
    return
  }

  // assertPassToClient() doesn't make sense if a onBeforeRender() hook was called on the client-side
  //  - (Because we don't know whether the user expects the pageContext value to be defined directly on the client-side.)
  if (!pageContext._hasPageContextFromServer) {
    return
  }

  assertUsage(false, errMsg)
}

const IGNORE_LIST = [
  'then',
  'toJSON' // Vue tries to get `toJSON`
]
function isMissing(pageContext: Record<string, unknown>, prop: string) {
  if (prop in pageContext) return false
  if (IGNORE_LIST.includes(prop)) return false
  if (typeof prop === 'symbol') return false // Vue tries to access some symbols
  if (typeof prop !== 'string') return false
  if (prop.startsWith('__v_')) return false // Vue internals upon `reactive(pageContext)`
  return true
}

function ignoreNextRead(prop: string) {
  globalObject.disableAssertPassToClient = prop
  window.setTimeout(() => {
    globalObject.disableAssertPassToClient = undefined
  }, 0)
}
