export { logErrorServer }

import pc from '@brillout/picocolors'
import { isCallable, isObject } from './utils.js'
import { execHookOnError } from './renderPage/execHookOnError.js'

function logErrorServer(err: unknown) {
  let errMod = err

  // TODO https://gist.github.com/brillout/066293a687ab7cf695e62ad867bc6a9c
  if (
    isObject(errMod) &&
    // Set by react-streaming
    // https://github.com/brillout/react-streaming/blob/0f93e09059a5936a1fb581bc1ce0bce473e0d5e0/src/server/renderToStream/common.ts#L36
    isCallable(errMod.prettifyThisError)
  ) {
    errMod = errMod.prettifyThisError(errMod)
  }

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  // - TO-DO/eventuually: is that still true? Let's eventually remove it and see if it crashes Cloudflare.
  const errStr = isObject(errMod) && 'stack' in errMod ? String(errMod.stack) : String(errMod)

  execHookOnError(errStr, err)

  console.error(pc.red(errStr))
}
