export { logErrorServer }

import pc from '@brillout/picocolors'
import { isObject } from '../utils.js'
import { execHookOnError } from './renderPageServer/execHookOnError.js'
import { assertPageContext_logRuntime, type PageContext_logRuntime } from './loggerRuntime.js'

// TODO implement
function logErrorServer(err: unknown, pageContext: PageContext_logRuntime) {
  assertPageContext_logRuntime(pageContext)

  execHookOnError(err)

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  // - TO-DO/eventually: is that still true? Let's eventually remove it and see if it crashes Cloudflare.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)

  console.error(pc.red(errStr))
}
