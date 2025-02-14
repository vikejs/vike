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
const globalObject = getGlobalObject<{ prev?: string }>('shared/getPageContextProxyForUser.ts', {})

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
        `Can't access pageContext${propName} on the client side. Because it can't be serialized, see server logs.`
      )
      passToClientHint(pageContext, prop, propName)
      return val
    }
  })
}

function passToClientHint(pageContext: PageContextForPassToClientWarning, prop: string, propName: string) {
  if (handleVueReactivity(prop)) return
  // `prop in pageContext` is the trick we use to know the passToClient value on the client-side, as we set a value to all passToClient props, even `undefined` ones:
  // ```html
  // <script id="vike_pageContext" type="application/json">{"pageProps":"!undefined"}</script>
  // ```
  if (prop in pageContext) return
  if (isWhitelisted(prop)) return
  // The trick described above (`prop in pageContext`) doesn't work if Vike doesn't fetch any pageContext from the server.
  // - There would still be some value to show a warning, but it isn't worth it because of the confusion that the first recommendation (adding `prop` to `passToClient`) wouldn't actually remove the warning, and only the second recommendation (using `prop in pageContext` instead of `pageContext[prop]`) would work.
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
  // Vue calls toJSON()
  'toJSON'
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
