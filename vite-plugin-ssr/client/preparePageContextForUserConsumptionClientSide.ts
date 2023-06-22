export { preparePageContextForUserConsumptionClientSide }
export type { PageContextForUserConsumptionClientSide }

import { assert, assertUsage, isObject, objectAssign, getGlobalObject } from './utils'
import { sortPageContext } from '../shared/sortPageContext'
import type { PageContextExports } from '../shared/getPageFiles'
const globalObject = getGlobalObject<{ disableAssertPassToClient?: string }>(
  'preparePageContextForUserConsumptionClientSide.ts',
  {}
)
import type { PageContextBuiltInClient as PageContextBuiltInClientServerRouter } from './types'
import type { PageContextBuiltInClient as PageContextBuiltInClientClientRouter } from './router/types'
import { addIs404ToPageProps } from '../shared/addIs404ToPageProps'
import type { PageConfig } from '../shared/page-configs/PageConfig'

type PageContextForUserConsumptionClientSide = PageContextExports & {
  _pageContextRetrievedFromServer: null | Record<string, unknown>
  _comesDirectlyFromServer: boolean
  _pageId: string
  _pageConfigs: PageConfig[]
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
function preparePageContextForUserConsumptionClientSide<T extends PageContextForUserConsumptionClientSide>(
  pageContext: T,
  isClientRouting: boolean
): T & { Page: unknown } {
  if (isClientRouting) {
    const pageContextTyped = pageContext as any as PageContextBuiltInClientClientRouter
    assert([true, false].includes(pageContextTyped.isHydration))
    assert([true, false, null].includes(pageContextTyped.isBackwardNavigation))
  } else {
    const pageContextTyped = pageContext as any as PageContextBuiltInClientServerRouter
    assert(pageContextTyped.isHydration === true)
    assert(pageContextTyped.isBackwardNavigation === null)
  }

  assert('config' in pageContext)
  assert('configEntries' in pageContext)
  // TODO/v1-release: remove
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
  const pageContextForUserConsumption = !pageContext._comesDirectlyFromServer
    ? // Not possible to achieve `getAssertPassToClientProxy()` if some `onBeforeRender()` hook defined in `.page.js` was called. (We cannot infer what `pageContext` properties came from the server-side or from the client-side. Which is fine because the user will likely dig into why the property is missing in `const pageContext = await runOnBeforeRenderServerHooks()` anyways, which does support throwing the helpul `assertPassToClient()` error message.)
      pageContext
    : getProxy(pageContext)

  addIs404ToPageProps(pageContext)

  return pageContextForUserConsumption
}

const JAVASCRIPT_BUILT_INS = [
  'then',
  'toJSON' // Vue tries to access `toJSON`
]
const PASS_TO_CLIENT_BUILT_INS = [
  '_pageId'
  // '_serverSideErrorWhileStreaming'
] as const

// Hint the user to use `paassToClient` when accessing undefined `pageContext` props
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
    if (globalObject.disableAssertPassToClient !== prop) {
      assertPassToClient(pageContext._pageContextRetrievedFromServer, prop, isMissing(prop))
    }

    // We disable `assertPassToClient` for the next attempt to read `prop`, because of how Vue's reactivity work.
    // (When changing a reactive object, Vue tries to read it's old value first. This triggers a `assertPassToClient()` failure if e.g. `pageContextOldReactive.routeParams = pageContextNew.routeParams` and `pageContextOldReactive` has no `routeParams`.)
    globalObject.disableAssertPassToClient = prop
    window.setTimeout(() => {
      globalObject.disableAssertPassToClient = undefined
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
    // If we didn't receive any `pageContext` from the server
    // - passToClient is irrelevant
    // - We cannot determine passToClientInferred
    return
  }
  const passToClientInferred = Object.keys(pageContextRetrievedFromServer).filter(
    (prop) => !(PASS_TO_CLIENT_BUILT_INS as any as string[]).includes(prop)
  )
  assertUsage(
    false,
    [
      `pageContext.${prop} isn't available in the browser`,
      `('${prop}' is missing in the passToClient list [${passToClientInferred
        .map((prop) => `'${prop}'`)
        .join(', ')}]).`,
      `Did you forget to add '${prop}' to the passToClient list?`,
      `See https://vite-plugin-ssr.com/passToClient`
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
