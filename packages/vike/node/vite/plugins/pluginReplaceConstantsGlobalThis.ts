export { pluginReplaceConstantsGlobalThis }

import type { Plugin } from 'vite'
import { assert, isDebug } from '../utils.js'

declare global {
  /** Like `import.meta.env.DEV` but works inside `node_modules/` (even if package is `ssr.external`). The value `undefined` is to be interpreted as `false`. */
  var __VIKE__IS_DEV: boolean | undefined
  /** Like `import.meta.env.SSR` but works inside `node_modules/` (even if package is `ssr.external`). The value `undefined` is to be interpreted as `false`. */
  var __VIKE__IS_CLIENT: boolean | undefined
  /**
   * Wehther a debug flag is enabled (either the global flag `DEBUG=vike` or a specific flag `DEBUG=vike:some-flag`).
   *
   * WARNING: must be used ONLY on the client-side. (The value is always `undefined` on the server-side.)
   *
   * In isomorhpic code, use `globalThis.__VIKE__IS_CLIENT` to make sure it's only used on the client-side.
   */
  var __VIKE__IS_DEBUG: boolean | undefined
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
          return {
            define: {
              'globalThis.__VIKE__IS_DEV': JSON.stringify(isDev),
            },
          }
        },
      },
      configEnvironment: {
        handler(name, config) {
          const consumer: 'server' | 'client' = config.consumer ?? (name === 'client' ? 'client' : 'server')
          const isClientSide = consumer === 'client'
          const defineIsDebug = !isClientSide
            ? {}
            : {
                // We purposely only define it on the client-side, because we cannot know the value in server-side ssr.external production.
                'globalThis.__VIKE__IS_DEBUG': JSON.stringify(isDebug()),
              }
          return {
            define: {
              'globalThis.__VIKE__IS_CLIENT': JSON.stringify(isClientSide),
              ...defineIsDebug,
            },
          }
        },
      },
    },
  ]
}
