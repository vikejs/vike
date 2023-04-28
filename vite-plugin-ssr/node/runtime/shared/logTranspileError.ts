export { logTranspileError }
export { isTranspileError }

// Copied & adapted from https://github.com/vitejs/vite/blob/9c114c5c72a6af87e3330d5573362554b4511265/packages/vite/src/node/server/middlewares/error.ts

// import strip from 'strip-ansi'
import colors from '@brillout/picocolors'
import { isObject } from '../utils'
import type { ViteDevServer, Rollup } from 'vite'
type RollupError = Rollup.RollupError

function isTranspileError(err: unknown): err is RollupError {
  return isObject(err) && !!err.id && !!err.frame
}

function buildErrorMessage(err: RollupError, args: string[] = [], includeStack = true): string {
  if (err.plugin) args.push(`  Plugin: ${colors.magenta(err.plugin)}`)
  const loc = err.loc ? `:${err.loc.line}:${err.loc.column}` : ''
  if (err.id) args.push(`  File: ${colors.cyan(err.id)}${loc}`)
  if (err.frame) args.push(colors.yellow(pad(err.frame)))
  if (includeStack && err.stack) args.push(pad(cleanStack(err.stack)))
  return args.join('\n')
}

function logTranspileError(server: ViteDevServer, err: RollupError): void {
  const msg = buildErrorMessage(err, [colors.red(`Transpilation Error. ${err.message}`)])

  server.config.logger.error(msg, {
    clear: true,
    timestamp: true,
    error: err as any // avoid Rollup and Vite's Rollup version mismatch
  })

  /* Showing the error layover doesn't properly work
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

// strip UTF-8 BOM
export function stripBomTag(content: string): string {
  if (content.charCodeAt(0) === 0xfeff) {
    return content.slice(1)
  }

  return content
}

const splitRE = /\r?\n/

function pad(source: string, n = 2): string {
  const lines = source.split(splitRE)
  return lines.map((l) => ` `.repeat(n) + l).join(`\n`)
}

function cleanStack(stack: string) {
  return stack
    .split(/\n/g)
    .filter((l) => /^\s*at/.test(l))
    .join('\n')
}
