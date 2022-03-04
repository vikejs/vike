import { assert, assertUsage, isObject, objectAssign } from './utils'
import { sortPageContext } from '../shared/sortPageContext'
import { PageContextBuiltInClient } from './types'

// Release `pageContext` for user consumption. This is mostly about adding `assertPassToClient()`.
export { releasePageContext }
export { releasePageContextInterim }

type PageContextPublic = PageContextBuiltInClient

// Release `pageContext` for user consumption, with Vue support (when `pageContext` is made reactive with Vue).
// For Vue + Cient Routing, the `pageContext` needs to be made reactive:
// ```js
// import { reactive } from 'vue'
// // See entire example at `/examples/vue-full/`
// const pageContextReactive = reactive(pageContext)
// ```
function releasePageContext<
  T extends PageContextPublic & {
    _pageContextRetrievedFromServer: null | Record<string, unknown>
    _comesDirectlyFromServer: boolean
    pageExports: Record<string, unknown>
    exports: Record<string, unknown>
  } & Record<string, unknown>,
>(pageContext: T) {
  assert('exports' in pageContext)
  assert('pageExports' in pageContext)
  assert(isObject(pageContext.pageExports))
  assert([true, false].includes(pageContext.isHydration))

  const Page = pageContext.exports.Page ?? pageContext.exports.default
  objectAssign(pageContext, { Page })

  // For Vue's reactivity
  resolveGetters(pageContext)

  // For prettier `console.log(pageContext)`
  sortPageContext(pageContext)

  assert([true, false].includes(pageContext._comesDirectlyFromServer))
  const pageContextReadyForRelease = !pageContext._comesDirectlyFromServer
    ? // Not possible to achieve `getAssertPassToClientProxy()` if some `onBeforeRender()` hook defined in `.page.js` was called. (We cannot infer what `pageContext` properties came from the server-side or from the client-side. Which is fine because the user will likely dig into why the property is missing in `const pageContext = await runOnBeforeRenderServerHooks()` anyways, which does support throwing the helpul `assertPassToClient()` error message.)
      pageContext
    : getAssertPassToClientProxyWithVueSupport(pageContext)

  return pageContextReadyForRelease
}

// Release `pageContext` for user consumption, when `const pageContext = await runOnBeforeRenderServerHooks()`.
// A priori, there is no need to be able to make `pageContext` Vue reactive here.
function releasePageContextInterim<T extends Record<string, unknown>>(
  pageContext: T,
  pageContextRetrievedFromServer: Record<string, unknown>,
) {
  // For prettier `console.log(pageContext)`
  sortPageContext(pageContext)

  const pageContextReadyForRelease = getAssertPassToClientProxy(pageContext, pageContextRetrievedFromServer)

  return pageContextReadyForRelease
}

const JAVASCRIPT_BUILT_INS = [
  'then',
  'toJSON', // Vue tries to access `toJSON`
]
const PASS_TO_CLIENT_BUILT_INS = ['_pageId', '_serverSideErrorWhileStreaming'] as const

// Without Vue hanlding
function getAssertPassToClientProxy<T extends Record<string, unknown>>(
  pageContext: T,
  pageContextRetrievedFromServer: Record<string, unknown>,
) {
  return new Proxy(pageContext, { get })

  function get(_: never, prop: string) {
    assertPassToClient(pageContextRetrievedFromServer, prop, isMissing(prop))
    return pageContext[prop]
  }

  function isMissing(prop: string) {
    if (prop in pageContext) return false
    if (JAVASCRIPT_BUILT_INS.includes(prop)) return false
    return true
  }
}

// With Vue hanlding
let disable: false | string = false
function getAssertPassToClientProxyWithVueSupport<
  T extends Record<string, unknown> & { _pageContextRetrievedFromServer: null | Record<string, unknown> },
>(pageContext: T): T {
  return new Proxy(pageContext, { get })

  function isMissing(prop: string) {
    if (prop in pageContext) return false
    if (JAVASCRIPT_BUILT_INS.includes(prop)) return false
    if (typeof prop === 'symbol') return false // Vue tries to access some symbols
    if (typeof prop !== 'string') return false
    if (prop.startsWith('__v_')) return false // Vue internals upon `reactive(pageContext)`
    return true
  }

  function get(_: never, prop: string) {
    if (disable !== false && disable !== prop) {
      assertPassToClient(pageContext._pageContextRetrievedFromServer, prop, isMissing(prop))
    }

    // We disable `assertPassToClient` for the next attempt to read `prop`, because of how Vue's reactivity work.
    // (When changing a reactive object, Vue tries to read it's old value first. This triggers a `assertPassToClient()` failure if e.g. `pageContextOldReactive.routeParams = pageContextNew.routeParams` and `pageContextOldReactive` has no `routeParams`.)
    disable = prop
    window.setTimeout(() => {
      disable = false
    }, 0)

    return pageContext[prop]
  }
}

function assertPassToClient(
  pageContextRetrievedFromServer: null | Record<string, unknown>,
  prop: string,
  isMissing: boolean,
) {
  if (!isMissing) {
    return
  }
  if (pageContextRetrievedFromServer === null) {
    // We cannot determine `passToClientInferred` if we didn't receive any `pageContext` from the server
    return
  }
  const passToClientInferred = Object.keys(pageContextRetrievedFromServer).filter(
    (prop) => !(PASS_TO_CLIENT_BUILT_INS as any as string[]).includes(prop),
  )
  assertUsage(
    false,
    [
      `\`pageContext.${prop}\` is not available in the browser.`,
      `Make sure that \`passToClient.includes('${prop}')\`.`,
      `(Currently \`passToClient\` is \`[${passToClientInferred.map((prop) => `'${prop}'`).join(', ')}]\`.)`,
      'More infos at https://vite-plugin-ssr.com/passToClient',
    ].join(' '),
  )
}

// Remove propery descriptor getters because they break Vue's reactivity.
// E.g. resolve the `pageContext.urlPathname` getter.
function resolveGetters(pageContext: Record<string, unknown>) {
  Object.entries(pageContext).forEach(([key, val]) => {
    delete pageContext[key]
    pageContext[key] = val
  })
}
