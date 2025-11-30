export { logErrorServer }

import pc from '@brillout/picocolors'
import { isDebugError, isObject } from '../utils.js'
import { execHookOnError } from './renderPageServer/execHookOnError.js'
import { assertPageContext_logRuntime, type PageContext_logRuntime } from './loggerRuntime.js'

// TODO implement +onHook(err, pageContext)
function logErrorServer(err: unknown, pageContext: PageContext_logRuntime) {
  assertPageContext_logRuntime(pageContext)

  execHookOnError(err)

  const errPrinted = getStackOrMessage(isDebugError() ? getOriginalErrorDeep(err) : err)
  console.error(hasRed(errPrinted) ? errPrinted : pc.red(errPrinted))
}

function getOriginalErrorDeep(err: any): unknown {
  if (!isObject(err) || !err.getOriginalError) return err
  // TODO: update link below
  // ErrorEnhanced https://gist.github.com/brillout/066293a687ab7cf695e62ad867bc6a9c
  return getOriginalErrorDeep((err as any).getOriginalError())
}

// We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
// - TO-DO/eventually: is that still true? Let's eventually remove it and see if it crashes Cloudflare.
function getStackOrMessage(err: any): string {
  if (!isObject(err) || !err.stack) return String(err)
  if (err.stackIsOptional) return err.message as string
  return err.stack as string
}

// TODO: dedupe by `$ mv utils/stripAnsi.ts utils/colors.ts`
function hasRed(str: string): boolean {
  // https://github.com/brillout/picocolors/blob/e291f2a3e3251a7f218ab6369ae94434d85d0eb0/picocolors.js#L57
  return str.includes('\x1b[31m')
}
