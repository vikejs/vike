export { assertNoInfiniteHttpRedirect }

import { assert, assertUsage, getGlobalObject, removeUrlOrigin } from '../../utils.js'
import pc from '@brillout/picocolors'

type Graph = Record<string, Set<string>>
const globalObject = getGlobalObject<{ redirectGraph: Graph }>('createHttpResponse/assertNoInfiniteHttpRedirect.ts', {
  redirectGraph: {}
})

function assertNoInfiniteHttpRedirect(
  // The exact URL that the user will be redirected to.
  // - It includes the Base URL as well as the locale (i18n) base.
  urlRedirectTarget: string,
  // Rationale for checking against `pageContextInit.urlOriginal`: https://github.com/vikejs/vike/pull/2264#issuecomment-2713890263
  pageContextInit: {
    urlOriginal: string
  }
) {
  // TO-DO/eventually: use cookie as described at https://github.com/vikejs/vike/pull/2273
  if (true as boolean) return; // Disabled until we make it reliable.

  if (!urlRedirectTarget.startsWith('/')) {
    // We assume that urlRedirectTarget points to an origin that is external (not the same origin), and we can therefore assume that the app doesn't define an infinite loop (at least not in itself).
    //  - There isn't a reliable way to check whether the redirect points to an external origin or the same origin; we hope/assume the user sets the URL without origin.
    //    ```js
    //    // For same-origin, the user usually/hopefully passes a URL without origin
    //    renderPage({ urlOriginal: '/some/pathname' })
    //    ```
    return
  }
  const urlOriginalNormalized = removeUrlOrigin(pageContextInit.urlOriginal).urlModified
  assert(urlOriginalNormalized.startsWith('/'))
  const graph = copy(globalObject.redirectGraph)
  graph[urlRedirectTarget] ??= new Set()
  graph[urlRedirectTarget]!.add(urlOriginalNormalized)
  validate(graph)
  globalObject.redirectGraph = graph
}

function copy(G: Graph): Graph {
  return Object.fromEntries(Object.entries(G).map(([key, val]) => [key, new Set(val)]))
}

// Adapted from: https://stackoverflow.com/questions/60904464/detect-cycle-in-directed-graph/60907076#60907076
function validate(G: Graph) {
  Object.keys(G).forEach((n) => check(G, n, []))
}
function check(G: Graph, n: string, path: string[]) {
  if (path.includes(n)) {
    const cycle = path.slice(path.indexOf(n)).concat(n)
    assertUsage(false, `Infinite loop of HTTP URL redirects: ${cycle.map(pc.cyan).join(' -> ')}`)
  }
  G[n]?.forEach((node) => check(G, node, [...path, n]))
}
