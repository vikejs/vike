export { pluginReplaceConstantsGlobalThis }

import type { Plugin } from 'vite'
import { assert, DebugFlag, getDebugFlags, isDebugGlobal } from '../utils.js'

declare global {
  /** Like `import.meta.env.DEV` but works inside `node_modules/` (even if package is `ssr.external`). The value `undefined` is to be interpreted as `false`. */
  var __VIKE__IS_DEV: boolean | undefined
  /** Like `import.meta.env.SSR` but works inside `node_modules/` (even if package is `ssr.external`). The value `undefined` is to be interpreted as `false`. */
  var __VIKE__IS_CLIENT: boolean | undefined
  /** WARNING: in server-side production, it's `undefined` (the value isn't known). For server-side only code, use `isDebugGlobal()` instead. */
  var __VIKE__IS_DEBUG_GLOBAL: boolean | undefined
  /** WARNING: in server-side production, it's `undefined` (the value isn't known). For server-side only code, use `isDebugActivated()` instead. */
  var __VIKE__DEBUG_FLAGS: DebugFlag[] | false | undefined
}

// === Explanation: globalThis.__VIKE__IS_DEV
// If client-side => always noExternal => globalThis.__VIKE__IS_DEV is set by the `define` config below.
// If server-side:
//   If ssr.noExternal => globalThis.__VIKE__IS_DEV is set by the `define` config below.
//   If `ssr.external`:
//     If not RunnableDevEnvironment (e.g. `@cloudflare/vite-plugin`) => always ssr.noExternal => globalThis.__VIKE__IS_DEV is set by the `define` config below.
//     If RunnableDevEnvironment (the default setup):
//       If dev/preview/pre-rendering => Vite is loaded, and server and Vite run inside the same process (because RunnableDevEnvironment) => globalThis.__VIKE__IS_DEV is set by the assignment below.
//       If production => Vite isn't loaded => globalThis.__VIKE__IS_DEV is `undefined` (it's never set) => value `undefined` is to be interpreted as `false`.

// === Explanation: globalThis.__VIKE__IS_CLIENT
// If client-side => always noExternal => globalThis.__VIKE__IS_CLIENT is set to `true` by the `define` config below.
// If server-side => globalThis.__VIKE__IS_CLIENT is either `false` or `undefined` (the value `undefined` is to be interpreted as `false`).

globalThis.__VIKE__IS_CLIENT = false

function pluginReplaceConstantsGlobalThis(): Plugin[] {
  return [
    {
      name: 'vike:pluginReplaceConstantsGlobalThis',
      config: {
        handler(config) {
          const isDev = config._isDev
          assert(typeof isDev === 'boolean')
          globalThis.__VIKE__IS_DEV = isDev
          const debugFlags = getDebugFlags()
          return {
            define: {
              'globalThis.__VIKE__IS_DEV': JSON.stringify(isDev),
              'globalThis.__VIKE__IS_DEBUG_GLOBAL': JSON.stringify(isDebugGlobal()),
              'globalThis.__VIKE__DEBUG_FLAGS': JSON.stringify(debugFlags.length === 0 ? false : debugFlags),
            },
          }
        },
      },
      configEnvironment: {
        handler(name, config) {
          const consumer: 'server' | 'client' = config.consumer ?? (name === 'client' ? 'client' : 'server')
          const isClientSide = consumer === 'client'
          return {
            define: {
              'globalThis.__VIKE__IS_CLIENT': JSON.stringify(isClientSide),
            },
          }
        },
      },
    },
  ]
}
