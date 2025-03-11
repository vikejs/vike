export { assertNoInfiniteHttpRedirect }

import { assert, assertUsage, getGlobalObject } from '../../utils.js'
import pc from '@brillout/picocolors'

type Graph = Record<string, Set<string>>
const globalObject = getGlobalObject<{ redirectGraph: Graph }>('createHttpResponse/assertNoInfiniteHttpRedirect.ts', {
  redirectGraph: {}
})

// It's too strict, see https://github.com/vikejs/vike/issues/1270#issuecomment-1820608999
// - Let's create a new setting `+doNotCatchInfiniteRedirect` if someone complains.
function assertNoInfiniteHttpRedirect(urlRedirectTarget: string, urlLogical: string) {
  if (!urlRedirectTarget.startsWith('/')) {
    // We assume that urlRedirectTarget points to an origin that is external (not the same origin), and we can therefore assume that the app doesn't define an infinite loop (at least not in itself).
    //  - There isn't a reliable way to check whether the redirect points to an external origin or the same origin; we hope/assume the user sets the URL without origin.
    //    ```js
    //    // For same-origin, the user usually/hopefully passes a URL without origin
    //    renderPage({ urlOriginal: '/some/pathname' })
    //    ```
    return
  }
  assert(urlLogical.startsWith('/'))
  const graph = copy(globalObject.redirectGraph)
  graph[urlRedirectTarget] ??= new Set()
  graph[urlRedirectTarget]!.add(urlLogical)
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
