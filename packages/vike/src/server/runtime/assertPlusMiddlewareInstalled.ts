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

// Called when the chain of +middleware is applied: on its first request, or when Vike's own dev and preview server registers it
function setPlusMiddlewareInstalled() {
  globalObject.installed = true
}

// renderPage() runs no +middleware, and universalHandler only the handlers: not applying the others would silently skip, for example, an auth check. The usage error is thrown to their caller
function assertPlusMiddlewareInstalled(globalContext: GlobalContextServerInternal) {
  if (globalObject.installed) return
  assertUsage(
    (globalContext.config.middleware ?? []).flat().length === 0,
    `Your ${pc.cyan('+middleware')} aren't applied: call ${pc.cyan('vike(app)')} before your routes, or apply ${pc.cyan('getUniversalMiddlewares()')} before Vike's handler (renderPage() runs no +middleware, and universalHandler only the handlers)`,
  )
}
