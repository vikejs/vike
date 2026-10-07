export { assertPlusMiddlewareInstalled }
export { setPlusMiddlewareInstalled }
export { whilePlusMiddlewareApplied }

import { assertUsage } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import type { GlobalContextServerInternal } from './globalContext.js'
import pc from '@brillout/picocolors'
import '../assertEnvServer.js'

const globalObject = getGlobalObject('runtime/assertPlusMiddlewareInstalled.ts', {
  // Only used for the error below: it doesn't turn anything on or off
  installed: false,
  // Vike's own dev and preview server running the chain: its +middleware may call renderPage()
  applying: 0,
})

// Called when the chain of +middleware runs on a request, before Vike's pages render in that same request
function setPlusMiddlewareInstalled() {
  globalObject.installed = true
}

async function whilePlusMiddlewareApplied<T>(fn: () => Promise<T>) {
  globalObject.applying++
  try {
    return await fn()
  } finally {
    globalObject.applying--
  }
}

// renderPage() and universalHandler run no +middleware: not applying them would silently skip, for example, an auth check. The usage error is thrown to their caller
function assertPlusMiddlewareInstalled(globalContext: GlobalContextServerInternal) {
  if (globalObject.installed || globalObject.applying > 0) return
  assertUsage(
    (globalContext.config.middleware ?? []).flat().length === 0,
    `Your ${pc.cyan('+middleware')} aren't applied: call ${pc.cyan('vike(app)')} before your routes, or apply ${pc.cyan('getUniversalMiddlewares()')} before Vike's handler (renderPage() and universalHandler run no +middleware)`,
  )
}
