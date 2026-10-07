export { assertPlusMiddlewareInstalled }
export { setPlusMiddlewareInstalled }

import { assertUsage } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import type { GlobalContextServerInternal } from './globalContext.js'
import pc from '@brillout/picocolors'
import '../assertEnvServer.js'

const globalObject = getGlobalObject('runtime/assertPlusMiddlewareInstalled.ts', {
  // Only used for the error below: it doesn't turn anything on or off
  installed: false,
})

// Called by getUniversalMiddlewares(), which the `vike(app)` of the server adapters calls
function setPlusMiddlewareInstalled() {
  globalObject.installed = true
}

// renderPage() and universalHandler run no +middleware: not applying them would silently skip, for example, an auth check
function assertPlusMiddlewareInstalled(globalContext: GlobalContextServerInternal) {
  if (globalObject.installed) return
  assertUsage(
    (globalContext.config.middleware ?? []).flat().length === 0,
    `Your ${pc.cyan('+middleware')} aren't applied: call ${pc.cyan('vike(app)')} before your routes, or apply ${pc.cyan('getUniversalMiddlewares()')} before Vike's handler (renderPage() and universalHandler run no +middleware)`,
  )
}
