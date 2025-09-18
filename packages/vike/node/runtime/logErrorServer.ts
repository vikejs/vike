export { logErrorServer }

import pc from '@brillout/picocolors'
import { isCallable, isObject } from './utils.js'
import { execHookOnError } from './renderPage/execHookOnError.js'

function logErrorServer(err: unknown) {
  execHookOnError(err)

  if (
    isObject(err) &&
    // Set by react-streaming
    // https://github.com/brillout/react-streaming/blob/0f93e09059a5936a1fb581bc1ce0bce473e0d5e0/src/server/renderToStream/common.ts#L36
    isCallable(err.prettifyThisError)
  ) {
    err = err.prettifyThisError(err)
  }

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  // - TO-DO/eventually: is that still true? Let's eventually remove it and see if it crashes Cloudflare.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)

  console.error(pc.red(errStr))
}
