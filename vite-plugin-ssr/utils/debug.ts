export { createDebugger }

import debug from 'debug'
import { assert } from './assert'
import { isBrowser } from './isBrowser'
assert(!isBrowser()) // Ensure the npm package `debug` to not be included in client-side bundles

// For `route.ts`: it's isomorphic and should not load `debug` on the client-side, instead it uses `debug()` only on the server-side.
// @ts-ignore
globalThis.__vite_plugin_ssr_createDebugger = createDebugger

function createDebugger(
  namespace: `vps:${string}`,
  options: { onlyWhenFocused?: true | string } = {},
): debug.Debugger['log'] {
  let DEBUG: undefined | string
  let DEBUG_FILTER: undefined | string
  // - `process` can be undefined in edge workers
  // - We want bundlers to be able to statically replace `process.env.*`
  try {
    DEBUG = process.env.DEBUG
  } catch {}
  try {
    DEBUG_FILTER = process.env.DEBUG_FILTER_VPS
  } catch {}
  try {
    DEBUG_FILTER ||= process.env.DEBUG_FILTER
  } catch {}

  const log = debug(namespace)

  const { onlyWhenFocused } = options
  const focus = typeof onlyWhenFocused === 'string' ? onlyWhenFocused : namespace

  return (msg: string, ...args: any[]) => {
    if (DEBUG_FILTER && !msg.includes(DEBUG_FILTER)) {
      return
    }
    if (onlyWhenFocused && !DEBUG?.includes(focus)) {
      return
    }
    log(msg, ...args)
  }
}
