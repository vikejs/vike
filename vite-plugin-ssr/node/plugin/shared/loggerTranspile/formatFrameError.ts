export { formatFrameError }
export { isFrameError }

// Copied & adapted from https://github.com/vitejs/vite/blob/9c114c5c72a6af87e3330d5573362554b4511265/packages/vite/src/node/server/middlewares/error.ts

import pc from '@brillout/picocolors'
import { assert, getFilePathVite, isObject } from '../../utils'

// Subset of:
// ```
// type RollupError = Rollup.RollupError
// ```
type RollupError = { id: string; frame: string; message: string }

function isFrameError(err: unknown): err is RollupError {
  if (!isObject(err)) return false
  const { id, frame, message } = err
  return typeof frame === 'string' && typeof id === 'string' && typeof message === 'string'
}

function buildErrorMessage(err: RollupError, args: string[] = []): string {
  assert(err.frame)
  args.push(pc.yellow(err.frame.trim()))
  return args.join('\n')
}

function formatFrameError(err: RollupError, userRootDir: string): string {
  assert(isFrameError(err))
  let msg = err.message
  if (/^Transform failed with \d error(|s):/.test(msg)) {
    msg = [
      pc.red('Failed to load'),
      pc.red(pc.bold(getFilePathVite(err.id, userRootDir))),
      pc.red('because of transpilation error:')
    ].join(' ')
  } else {
    msg = pc.red(msg)
  }
  msg = buildErrorMessage(err, [msg])
  return msg
  /* Last time we tried showing the error layover didn't properly work
  server.ws.send({
    type: 'error',
    err: prepareError(err)
  })
  */
}
/*
function prepareError(err: any): any {
  // only copy the information we need and avoid serializing unnecessary
  // properties, since some errors may attach full objects (e.g. PostCSS)
  return {
    message: strip(err.message),
    stack: strip(cleanStack(err.stack || '')),
    id: err.id,
    frame: strip(err.frame || ''),
    plugin: err.plugin,
    pluginCode: err.pluginCode,
    loc: err.loc
  }
}
*/
