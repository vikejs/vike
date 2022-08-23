export { releasePageContextCommon }
export type { PageContextRelease }

import { assert, assertUsage, isObject, objectAssign } from './utils'
import { sortPageContext } from '../shared/sortPageContext'
import type { PageContextExports } from '../shared/getPageFiles'

type PageContextRelease = PageContextExports & {
  _pageContextRetrievedFromServer: null | Record<string, unknown>
  _comesDirectlyFromServer: boolean
}

// Release `pageContext` for user consumption.
//
// This adds `assertPassToClient()`.
//
// With Vue support (when `pageContext` is made reactive with Vue).
//
// For Vue + Cient Routing, the `pageContext` needs to be made reactive:
// ```js
// import { reactive } from 'vue'
// // See entire example at `/examples/vue-full/`
// const pageContextReactive = reactive(pageContext)
// ```
function releasePageContextCommon<T extends PageContextRelease>(pageContext: T) {
  assert('exports' in pageContext)
  assert('exportsAll' in pageContext)
  assert('pageExports' in pageContext)
  assert(isObject(pageContext.pageExports))

  const Page = pageContext.exports.Page
  objectAssign(pageContext, { Page })

  // For Vue's reactivity
  resolveGetters(pageContext)

  // For prettier `console.log(pageContext)`
  sortPageContext(pageContext)

  assert([true, false].includes(pageContext._comesDirectlyFromServer))
  const pageContextReadyForRelease = !pageContext._comesDirectlyFromServer
    ? // Not possible to achieve `getAssertPassToClientProxy()` if some `onBeforeRender()` hook defined in `.page.js` was called. (We cannot infer what `pageContext` properties came from the server-side or from the client-side. Which is fine because the user will likely dig into why the property is missing in `const pageContext = await runOnBeforeRenderServerHooks()` anyways, which does support throwing the helpul `assertPassToClient()` error message.)
      pageContext
    : getProxy(pageContext)

  return pageContextReadyForRelease
}

const JAVASCRIPT_BUILT_INS = [
  'then',
  'toJSON' // Vue tries to access `toJSON`
]
const PASS_TO_CLIENT_BUILT_INS = ['_pageId', '_serverSideErrorWhileStreaming'] as const

// Hints the user to use `paassToClient` when accessing undefined `pageContext` props
let disable: false | string = false
function getProxy<
  T extends Record<string, unknown> & { _pageContextRetrievedFromServer: null | Record<string, unknown> }
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
  isMissing: boolean
) {
  if (!isMissing) {
    return
  }
  if (pageContextRetrievedFromServer === null) {
    // We cannot determine `passToClientInferred` if we didn't receive any `pageContext` from the server
    return
  }
  const passToClientInferred = Object.keys(pageContextRetrievedFromServer).filter(
    (prop) => !(PASS_TO_CLIENT_BUILT_INS as any as string[]).includes(prop)
  )
  assertUsage(
    false,
    [
      `\`pageContext.${prop}\` is not available in the browser.`,
      `Make sure that \`passToClient.includes('${prop}')\`.`,
      `(Currently \`passToClient\` is \`[${passToClientInferred.map((prop) => `'${prop}'`).join(', ')}]\`.)`,
      'More infos at https://vite-plugin-ssr.com/passToClient'
    ].join(' ')
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
