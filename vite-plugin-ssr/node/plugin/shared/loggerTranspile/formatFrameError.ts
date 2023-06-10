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
  if (
    // Replace:
    //   9:24:18 PM [vite][request(1)] Transform failed with 1 error:
    //   /home/rom/code/vite-plugin-ssr/examples/react-full-v1/components/Counter.tsx:1:8: ERROR: Expected ";" but found "React"
    //   Expected ";" but found "React"
    // With:
    //   9:26:49 PM [vite][request(1)] Failed to load /components/Counter.tsx because of transpilation error:
    /^Transform failed with \d error(|s):/.test(msg) ||
    // Replace:
    //   9:19:55 PM [vite] /home/rom/code/vite-plugin-ssr/examples/react-full-v1/components/Counter.tsx: Missing semicolon. (1:7)
    // With:
    //   9:19:55 PM [vite] /home/rom/code/vite-plugin-ssr/examples/react-full-v1/components/Counter.tsx: Missing semicolon. (1:7)
    //   9:26:49 PM [vite] Failed to load /components/Counter.tsx because of transpilation error:
    /^\/[^\s]+:\s/.test(msg)
  ) {
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
