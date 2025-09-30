export { logErrorServer }

import pc from '@brillout/picocolors'
import { isObject } from './utils.js'
import { execHookOnError } from './renderPage/execHookOnError.js'

function logErrorServer(err: unknown) {
  execHookOnError(err)

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  // - TO-DO/eventually: is that still true? Let's eventually remove it and see if it crashes Cloudflare.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)

  console.error(pc.red(errStr))
}
