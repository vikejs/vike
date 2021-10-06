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
  const passToClientInferred = Object.keys(pageContext._pageContextRetrievedFromServer).filter(
    (prop) => !(PASS_TO_CLIENT_BUILT_INS as any as string[]).includes(prop)
  )
  assertUsage(
    !isMissing,
    [
      `\`pageContext.${prop}\` is not available in the browser.`,
      `Make sure that \`passToClient.includes('${prop}')\`.`,
      `(Currently \`passToClient\` is \`[${passToClientInferred.map((prop) => `'${prop}'`).join(', ')}]\`.)`,
      'More infos at https://vite-plugin-ssr.com/passToClient'
    ].join(' ')
  )
}
