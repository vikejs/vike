export { createDebugger }
export type { Debug }

import debug from 'debug'
import { assert } from './assert'
import { isBrowser } from './isBrowser'
assert(!isBrowser()) // Ensure the npm package `debug` to not be included in client-side bundles

export const debugGlob = createDebugger('vps:glob')

// For `route.ts`: it's isomorphic and should not load `debug` on the client-side, instead it uses `debug()` only on the server-side.
// @ts-ignore
globalThis.__vite_plugin_ssr_createDebugger = createDebugger

type Debug = ReturnType<typeof createDebugger>

function createDebugger(namespace: `vps:${string}`) {
  let DEBUG: undefined | string
  // - `process` can be undefined in edge workers
  // - We want bundlers to be able to statically replace `process.env.*`
  try {
    DEBUG = process.env.DEBUG
  } catch {}

  const log = debug(namespace)

  return (name: string, msg?: unknown, options?: { noneMsg?: string }) => {
    if (!DEBUG?.includes(namespace)) {
      return
    }
    const msgStr = msg && str(msg, options ?? {})
    log(name, msgStr)
  }
}

function str(msg: unknown, { noneMsg = 'None' }): string {
  if (typeof msg === 'string') {
    return msg
  }
  if (Array.isArray(msg)) {
    if (msg.length === 0) {
      return noneMsg
    }
    return '\n' + msg.map(strLine).join('\n')
  }
  return strLine(msg)
}

function strLine(entry: unknown) {
  return '   - ' + (typeof entry === 'string' ? entry : JSON.stringify(entry))
}
