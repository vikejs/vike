export { assertNoInfiniteHttpRedirect }

import { assert, assertUsage, getGlobalObject } from '../../utils.js'
import pc from '@brillout/picocolors'

type Graph = Record<string, Set<string>>
const globalObject = getGlobalObject<{ redirectGraph: Graph }>('assertNoInfiniteHttpRedirect.ts', {
  redirectGraph: {}
})

function assertNoInfiniteHttpRedirect(urlSource: string, urlPathnameLogical: string) {
  assert(urlSource.startsWith('/'))
  assert(urlPathnameLogical.startsWith('/'))
  const graph = copy(globalObject.redirectGraph)
  graph[urlSource] ??= new Set()
  graph[urlSource]!.add(urlPathnameLogical)
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
    assertUsage(false, `Infinite loop of HTTP URL redirects: ${cycle.map(pc.bold).join(' -> ')}`)
  }
  G[n]?.forEach((node) => check(G, node, [...path, n]))
}
function validate(G: Graph) {
  Object.keys(G).forEach((n) => check(G, n, []))
}
