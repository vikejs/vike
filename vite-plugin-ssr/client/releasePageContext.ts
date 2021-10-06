import { assert, assertUsage, isObject } from '../shared/utils'
import { sortPageContext } from '../shared/sortPageContext'

export { releasePageContext }

function releasePageContext<
  T extends {
    Page: unknown
    pageExports: Record<string, unknown>
    isHydration: boolean
    _pageContextRetrievedFromServer: null | Record<string, unknown>
  } & Record<string, unknown>
>(pageContext: T) {
  assert('Page' in pageContext)
  assert(isObject(pageContext.pageExports))
  assert([true, false].includes(pageContext.isHydration))

  // For Vue's reactivity
  resolveGetters(pageContext)

  // For prettier `console.log(pageContext)`
  sortPageContext(pageContext)

  const pageContextProxy = getPageContextProxy(pageContext)

  return pageContextProxy
}

const JAVASCRIPT_BUILT_INS = [
  'then',
  'toJSON' // Vue tries to access `toJSON`
]
const PASS_TO_CLIENT_BUILT_INS = ['_pageId', '_serverSideErrorWhileStreaming'] as const

function getPageContextProxy<
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
    assertPassToClient(pageContext, prop, isMissing(prop))

    // We disable `assertPassToClient` for the next attempt to read `prop`, because of how Vue's reactivity work.
    // (When changing a reactive object, Vue tries to read it's old value first. This triggers a `assertPassToClient()` failure if e.g. `pageContextOldReactive.routeParams = pageContextNew.routeParams` and `pageContextOldReactive` has no `routeParams`.)
    assertPassToClientDisable(prop)
    window.setTimeout(() => {
      assertPassToClientEnable()
    }, 0)

    return pageContext[prop]
  }
}

function assertPassToClient(
  pageContext: { _pageContextRetrievedFromServer: null | Record<string, unknown> },
  prop: string,
  isMissing: boolean
) {
  if (pageContext._pageContextRetrievedFromServer === null) {
    // We cannot infer `passToClient` if we didn't receive any `pageContext` from the server
    return
  }
  if (assertPassToClientDisabled === prop) {
    return
  }
  if (!isMissing) {
    return
  }
  const passToClientInferred = Object.keys(pageContext._pageContextRetrievedFromServer).filter(
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

let assertPassToClientDisabled: false | string = false
function assertPassToClientEnable() {
  assertPassToClientDisabled = false
}
function assertPassToClientDisable(prop: string) {
  assertPassToClientDisabled = prop
}

// Remove propery descriptor getters because they break Vue's reactivity
function resolveGetters(pageContext: Record<string, unknown>) {
  Object.entries(pageContext).forEach(([key, val]) => {
    delete pageContext[key]
    pageContext[key] = val
  })
}
