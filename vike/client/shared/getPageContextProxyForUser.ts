export { getPageContextProxyForUser }
export { PageContextForPassToClientWarning }

import {
  assert,
  assertUsage,
  assertWarning,
  getGlobalObject,
  getPropAccessNotation
} from '../server-routing-runtime/utils.js'
import { notSerializable } from '../../shared/notSerializable.js'
const globalObject = getGlobalObject<{ prev?: string }>('getPageContextProxyForUser.ts', {})

type PageContextForPassToClientWarning = {
  _hasPageContextFromServer: boolean
  _hasPageContextFromClient: boolean
}

/**
 * Throw error when pageContext value isn't:
 * - serializable, or
 * - defined.
 */
function getPageContextProxyForUser<PageContext extends Record<string, unknown> & PageContextForPassToClientWarning>(
  pageContext: PageContext
): PageContext {
  assert([true, false].includes(pageContext._hasPageContextFromServer))
  assert([true, false].includes(pageContext._hasPageContextFromClient))
  return new Proxy(pageContext, {
    get(_: never, prop: string) {
      const val = pageContext[prop]
      const propName = getPropAccessNotation(prop)
      assertUsage(
        val !== notSerializable,
        `pageContext${propName} couldn't be serialized and, therefore, is missing on the client-side. Check the server logs for more information.`
      )
      passToClientHint(pageContext, prop, propName)
      return val
    }
  })
}

function passToClientHint(pageContext: PageContextForPassToClientWarning, prop: string, propName: string) {
  if (handleVueReactivity(prop)) return
  // `prop in pageContext` is the trick we use to know the passToClient value on the client-side, as we set values to `undefined`:
  // ```html
  // <script id="vike_pageContext" type="application/json">{"pageProps":"!undefined"}</script>
  // ```
  if (prop in pageContext) return
  if (isWhitelisted(prop)) return
  if (!pageContext._hasPageContextFromServer) return

  const errMsg = `pageContext${propName} isn't defined on the client-side, see https://vike.dev/passToClient#error`
  if (
    // TODO/next-major-release always make it an error.
    // - Remove pageContext._hasPageContextFromClient logic (IIRC this is its only use case).
    pageContext._hasPageContextFromClient
  ) {
    assertWarning(false, errMsg, { onlyOnce: false, showStackTrace: true })
  } else {
    assertUsage(false, errMsg)
  }
}

const WHITELIST = [
  'then',
  'toJSON' // Vue triggers `toJSON`
]
function isWhitelisted(prop: string): boolean {
  if (WHITELIST.includes(prop)) return true
  if (typeof prop === 'symbol') return true // Vue tries to access some symbols
  if (typeof prop !== 'string') return true
  if (prop.startsWith('__v_')) return true // Vue internals upon `reactive(pageContext)`
  return false
}

// Handle Vue's reactivity.
// When changing a reactive object:
// - Vue tries to read its old value first. This triggers a `assertIsDefined()` failure if e.g. `pageContextReactive.routeParams = pageContextNew.routeParams` and `pageContextReactive` has no `routeParams`.
// - Vue seems to read __v_raw before reading the property.
function handleVueReactivity(prop: string): boolean {
  if (globalObject.prev === prop || globalObject.prev === '__v_raw') return true
  globalObject.prev = prop
  window.setTimeout(() => {
    globalObject.prev = undefined
  }, 0)
  return false
}
