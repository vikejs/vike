export { logErrorServer }

import pc from '@brillout/picocolors'
import { assert, isCallable, isObject } from '../utils.js'
import { execHookOnError } from './renderPageServer/execHookOnError.js'
import type { PageContext_logRuntime } from './loggerRuntime.js'

// TODO implement
// TODO not optional
function logErrorServer(err: unknown, pageContext: PageContext_logRuntime) {
  assert(
    pageContext === 'NULL_TEMP' ||
      typeof pageContext._httpRequestId === 'number' ||
      pageContext._httpRequestId === null,
  )

  execHookOnError(err)

  // Set by react-streaming
  // - https://github.com/brillout/react-streaming/blob/0fb5510d0a5a614f577668a519bccd62de40aed8/src/server/renderToStream/common.ts#L59-L62
  // - https://gist.github.com/brillout/066293a687ab7cf695e62ad867bc6a9c
  // - It doesn't seem to be needed? (The error Vike receives is already enhanced.) Should we remove this?
  if (isObject(err) && isCallable(err.getEnhancedError)) {
    err = err.getEnhancedError(err)
  }

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  // - TO-DO/eventually: is that still true? Let's eventually remove it and see if it crashes Cloudflare.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)

  console.error(pc.red(errStr))
}
