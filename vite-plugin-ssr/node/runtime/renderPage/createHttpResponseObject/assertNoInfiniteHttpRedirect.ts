export { assertNoInfiniteHttpRedirect }

import { assert, assertUsage, getGlobalObject } from '../../utils.js'
import pc from '@brillout/picocolors'

type Graph = Record<string, Set<string>>
const globalObject = getGlobalObject<{ redirectGraph: Graph }>('assertNoInfiniteHttpRedirect.ts', {
  redirectGraph: {}
})

function assertNoInfiniteHttpRedirect(urlRedirectOriginal: string, urlRedirectPathnameLogical: string) {
  if (urlRedirectOriginal.startsWith('http')) {
    // We assume that the redirect points to an external origin, and we can therefore assume that the app doesn't define an infinite loop (in itself).
    //  - There isn't a reliable way to check whether the redirect points to an external origin or the same origin: the user usually passes the URL without origin.
    //    ```js
    //    // URL origin is usually missing
    //    renderPage({ urlOriginal: '/some/pathname' })
    //    ```
    return
  }
  assert(urlRedirectOriginal.startsWith('/'))
  assert(urlRedirectPathnameLogical.startsWith('/'))
  const graph = copy(globalObject.redirectGraph)
  graph[urlRedirectOriginal] ??= new Set()
  graph[urlRedirectOriginal]!.add(urlRedirectPathnameLogical)
  validate(graph)
  globalObject.redirectGraph = graph
}

function copy(G: Graph): Graph {
  return Object.fromEntries(Object.entries(G).map(([key, val]) => [key, new Set(val)]))
}

// Adapted from: https://stackoverflow.com/questions/60904464/detect-cycle-in-directed-graph/60907076#60907076
function check(G: Graph, n: string, path: string[]) {
  if (path.includes(n)) {
    const cycle = path.slice(path.indexOf(n)).concat(n)
    assertUsage(false, `Infinite loop of HTTP URL redirects: ${cycle.map(pc.cyan).join(' -> ')}`)
  }
  G[n]?.forEach((node) => check(G, node, [...path, n]))
}
function validate(G: Graph) {
  Object.keys(G).forEach((n) => check(G, n, []))
}
