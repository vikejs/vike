export { debug }
export { setCreateDebugger }

// Using createDebugger() for isomorphic code without bloating the client-side.
// On the server-side, this is just a transparent proxy.
// On the client-side, this is an emtpy shell.

import { getGlobalObject } from '../../utils/getGlobalObject.js'
import type { createDebugger, Debug } from '../../utils/debug.js'
type CreateDebugger = typeof createDebugger

const globalObject = getGlobalObject<{
  debug?: Debug
  createDebugger?: CreateDebugger
}>('route/debug.ts', {})

function debug(...args: Parameters<Debug>) {
  // Client-side => does nothing
  if (!globalObject.createDebugger) return

  // Server-side => just a proxy
  if (!globalObject.debug) {
    globalObject.debug = globalObject.createDebugger('vike:routing')
  }
  globalObject.debug(...args)
}

// Called only on the server-side
function setCreateDebugger(createDebugger: CreateDebugger) {
  globalObject.createDebugger = createDebugger
}
