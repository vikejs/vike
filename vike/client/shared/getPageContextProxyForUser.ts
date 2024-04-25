export { getPageContextProxyForUser }
export { PageContextForPassToClientWarning }

import { assert, assertUsage, assertWarning, getGlobalObject } from '../server-routing-runtime/utils.js'
import { notSerializable } from '../../shared/notSerializable.js'
const globalObject = getGlobalObject<{ prev?: string }>('getPageContextProxyForUser.ts', {})

type PageContextForPassToClientWarning = {
  _hasPageContextFromServer: boolean
  _hasPageContextFromClient: boolean
}

/**
 * - Throw error when pageContext value isn't serializable
 * - Throw error when pageContext prop is missing in passToClient
 */
function getPageContextProxyForUser<PageContext extends Record<string, unknown> & PageContextForPassToClientWarning>(
  pageContext: PageContext
): PageContext {
  assert([true, false].includes(pageContext._hasPageContextFromServer))
  assert([true, false].includes(pageContext._hasPageContextFromClient))
  return new Proxy(pageContext, {
    get(_: never, prop: string) {
      const val = pageContext[prop]
      const propName = JSON.stringify(prop)
      assertUsage(
        val !== notSerializable,
        `pageContext[${propName}] couldn't be serialized and, therefore, is missing on the client-side. Check the server logs for more information.`
      )
      assertIsDefined(pageContext, prop)
      return val
    }
  })
}

function assertIsDefined(pageContext: PageContextForPassToClientWarning, prop: string) {
  if (handleVueReactivity(prop)) return
  if (prop in pageContext) return
  if (isWhitelisted(prop)) return
  // - If no pageContext was fetched from the server, then adding props to passToClient is useless.
  // - Showing a warning, even though no pageContext was fetched from the server, is actually erroneous as the client runtime cannot deduce the passToClient list.
  if (!pageContext._hasPageContextFromServer) return

  const propName = JSON.stringify(prop)

  /* This handling would be the clearest but, unfortunately, it's fundamentally problematic:
   *  - It would force the pageContext value consumer to be synchronized with the pageContext value provider. For example, if vike-react wants to conditionally do something dependening on wehther some optional pageContext value was provided by some optional vike-react-* integration package.
   *  - If a pageContext value is set by an optional hook, then it's expected that the value is undefined if the hook doesn't exist.
  const errMsg = `pageContext[${propName}] is \`undefined\` on the client-side. If it's defined on the server-side then add ${propName} to passToClient (https://vike.dev/passToClient), otherwise make sure your client-side hooks always define it (e.g. set it to \`null\` instead of \`undefined\`).`
  assertUsage(false, errMsg)
  */

  if (!pageContext._hasPageContextFromClient) {
    // We can safely assume that the property is missing in passToClient, because the server-side defines all passToClient properties even if they have an undefined value:
    // ```
    // <script id="vike_pageContext" type="application/json">{"_pageId":"/pages/admin","user":"!undefined","pageProps":"!undefined","title":"!undefined","abortReason":"!undefined","_urlRewrite":null}</script>
    // ```
    // Note how properties have "!undefined" values => we can tell whether an undefined pageContext value exists in passToClient.
    assertUsage(
      false,
      `pageContext[${propName}] isn't available on the client-side because ${propName} is missing in passToClient, see https://vike.dev/passToClient`
    )
  } else {
    // TODO/next-major-release make it an assertUsage()
    assertWarning(
      false,
      [
        `pageContext[${propName}] isn't defined on the client-side:`,
        `1. if it's defined by the server-side then add ${propName} to passToClient (https://vike.dev/passToClient), or`,
        `2. if it's expected that it may not be defined:`,
        '   ```js',
        '   // ❌ Replace code like this:',
        `   const val = pageContext[${propName}] ?? someDefaultValue`,
        '   // ✅ With that:',
        `   const val = ${propName} in pageContext ? pageContext[${propName}] : someDefaultValue`,
        '   ```',
        `See stack track below to find where pageContext[${propName}] is being accessed.`
      ].join('\n'),
      { showStackTrace: true, onlyOnce: false }
    )
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
