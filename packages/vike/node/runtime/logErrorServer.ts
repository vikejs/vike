export { logErrorServer }

import pc from '@brillout/picocolors'
import { isCallable, isObject } from './utils.js'
import { execHookOnError } from './renderPage/execHookOnError.js'

function logErrorServer(err: unknown) {
  execHookOnError(err)

  // Set by react-streaming
  // - https://github.com/brillout/react-streaming/blob/0eaf7099651ffb27e61c0bf6b5a01657c9225f08/src/server/renderToStream/common.ts#L57-L65
  // - It doesn't seem to be needed? (The error Vike receives is already enhanced.) Should we remove this?
  if (isObject(err) && isCallable(err.getEnhancedError)) {
    err = err.getEnhancedError(err)
  }

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  // - TO-DO/eventually: is that still true? Let's eventually remove it and see if it crashes Cloudflare.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)

  console.error(pc.red(errStr))
}
